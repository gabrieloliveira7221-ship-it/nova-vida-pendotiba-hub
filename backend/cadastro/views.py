from datetime import date

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import Count, F
from django.db.models.functions import TruncMonth
from django.http import Http404
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse, reverse_lazy
from django.utils import timezone
from django.utils.http import url_has_allowed_host_and_scheme
from django.views import View
from django.views.generic import (
    CreateView,
    DeleteView,
    DetailView,
    FormView,
    ListView,
    TemplateView,
    UpdateView,
)

from .forms import AtendimentoForm, EventoForm, PessoaForm, SolicitacaoForm
from .models import Atendimento, Bairro, Evento, Pessoa, TipoAtendimento

NOMES_MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]


# --- Área pública -----------------------------------------------------------


class AgendaView(ListView):
    template_name = "cadastro/agenda.html"
    context_object_name = "eventos"

    def get_queryset(self):
        return Evento.objects.filter(data__gte=timezone.localdate())


class SolicitarAtendimentoView(FormView):
    template_name = "cadastro/solicitar.html"
    form_class = SolicitacaoForm
    success_url = reverse_lazy("agenda")

    def form_valid(self, form):
        form.salvar()
        messages.success(
            self.request,
            "Solicitação enviada! A equipe da igreja vai entrar em contato pelo telefone informado.",
        )
        return super().form_valid(form)


# --- Gestão -----------------------------------------------------------------


class PainelView(LoginRequiredMixin, TemplateView):
    template_name = "cadastro/painel.html"

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        hoje = timezone.localdate()
        contexto.update(
            total_pessoas=Pessoa.objects.count(),
            atendimentos_no_mes=Atendimento.objects.filter(
                data__year=hoje.year, data__month=hoje.month
            ).count(),
            solicitacoes=Atendimento.objects.filter(
                status=Atendimento.Status.SOLICITADO
            ).count(),
            proximos_eventos=Evento.objects.filter(data__gte=hoje)[:3],
            ultimos_atendimentos=Atendimento.objects.select_related("pessoa", "tipo")[:5],
        )
        return contexto


# Pessoas


class PessoaListView(LoginRequiredMixin, ListView):
    template_name = "cadastro/pessoa_lista.html"
    context_object_name = "pessoas"
    paginate_by = 20

    def get_queryset(self):
        pessoas = Pessoa.objects.select_related("bairro")
        busca = self.request.GET.get("q", "").strip()
        bairro = self.request.GET.get("bairro", "")
        if busca:
            pessoas = pessoas.filter(nome_completo__icontains=busca)
        if bairro.isdigit():
            pessoas = pessoas.filter(bairro_id=bairro)
        return pessoas

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        contexto["bairros"] = Bairro.objects.all()
        return contexto


class PessoaDetailView(LoginRequiredMixin, DetailView):
    model = Pessoa
    template_name = "cadastro/pessoa_detalhe.html"
    context_object_name = "pessoa"

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        contexto["atendimentos"] = self.object.atendimentos.select_related("tipo", "usuario")
        return contexto


class PessoaCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = Pessoa
    form_class = PessoaForm
    template_name = "cadastro/pessoa_form.html"
    success_url = reverse_lazy("pessoas")
    success_message = "%(nome_completo)s foi cadastrado(a)."


class PessoaUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = Pessoa
    form_class = PessoaForm
    template_name = "cadastro/pessoa_form.html"
    success_message = "Cadastro de %(nome_completo)s atualizado."

    def get_success_url(self):
        return reverse("pessoa_detalhe", args=[self.object.pk])


class PessoaDeleteView(LoginRequiredMixin, SuccessMessageMixin, DeleteView):
    model = Pessoa
    template_name = "cadastro/confirmar_exclusao.html"
    success_url = reverse_lazy("pessoas")
    success_message = "Pessoa excluída."
    extra_context = {
        "aviso": "Todos os atendimentos dessa pessoa também serão excluídos.",
        "voltar": "pessoas",
    }


# Atendimentos


class AtendimentoListView(LoginRequiredMixin, ListView):
    template_name = "cadastro/atendimento_lista.html"
    context_object_name = "atendimentos"
    paginate_by = 20

    def get_queryset(self):
        atendimentos = Atendimento.objects.select_related("pessoa", "tipo", "usuario")
        filtros = self.request.GET
        if busca := filtros.get("q", "").strip():
            atendimentos = atendimentos.filter(pessoa__nome_completo__icontains=busca)
        if (tipo := filtros.get("tipo", "")).isdigit():
            atendimentos = atendimentos.filter(tipo_id=tipo)
        if (status := filtros.get("status", "")) in Atendimento.Status.values:
            atendimentos = atendimentos.filter(status=status)
        if dia := filtros.get("data", ""):
            try:
                atendimentos = atendimentos.filter(data=date.fromisoformat(dia))
            except ValueError:
                pass
        return atendimentos

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        contexto["tipos"] = TipoAtendimento.objects.all()
        contexto["situacoes"] = Atendimento.Status.choices
        return contexto


class AtendimentoCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = Atendimento
    form_class = AtendimentoForm
    template_name = "cadastro/atendimento_form.html"
    success_url = reverse_lazy("atendimentos")
    success_message = "Atendimento registrado."

    def get_initial(self):
        inicial = super().get_initial()
        if (pessoa := self.request.GET.get("pessoa", "")).isdigit():
            inicial["pessoa"] = pessoa
        return inicial

    def form_valid(self, form):
        form.instance.usuario = self.request.user
        return super().form_valid(form)


class AtendimentoUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = Atendimento
    form_class = AtendimentoForm
    template_name = "cadastro/atendimento_form.html"
    success_url = reverse_lazy("atendimentos")
    success_message = "Atendimento atualizado."

    def form_valid(self, form):
        if form.instance.usuario is None:
            form.instance.usuario = self.request.user
        return super().form_valid(form)


class AtendimentoDeleteView(LoginRequiredMixin, SuccessMessageMixin, DeleteView):
    model = Atendimento
    template_name = "cadastro/confirmar_exclusao.html"
    success_url = reverse_lazy("atendimentos")
    success_message = "Atendimento excluído."
    extra_context = {"voltar": "atendimentos"}


class AtendimentoSituacaoView(LoginRequiredMixin, View):
    """Botões rápidos da lista: aceitar solicitação, marcar como realizado ou cancelar."""

    acoes = {
        "aceitar": (Atendimento.Status.AGENDADO, "Solicitação aceita e agendada."),
        "realizar": (Atendimento.Status.REALIZADO, "Atendimento marcado como realizado."),
        "cancelar": (Atendimento.Status.CANCELADO, "Atendimento cancelado."),
    }

    def post(self, request, pk, acao):
        if acao not in self.acoes:
            raise Http404
        atendimento = get_object_or_404(Atendimento, pk=pk)
        novo_status, mensagem = self.acoes[acao]
        atendimento.status = novo_status
        if atendimento.usuario is None:
            atendimento.usuario = request.user
        atendimento.save(update_fields=["status", "usuario"])
        messages.success(request, mensagem)

        proximo = request.POST.get("proximo", "")
        if url_has_allowed_host_and_scheme(proximo, allowed_hosts={request.get_host()}):
            return redirect(proximo)
        return redirect("atendimentos")


# Eventos


class EventoListView(LoginRequiredMixin, ListView):
    template_name = "cadastro/evento_lista.html"
    context_object_name = "eventos"
    paginate_by = 20

    def get_queryset(self):
        eventos = Evento.objects.all()
        if busca := self.request.GET.get("q", "").strip():
            eventos = eventos.filter(nome__icontains=busca)
        if self.request.GET.get("todos") != "1":
            eventos = eventos.filter(data__gte=timezone.localdate())
        return eventos


class EventoCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = Evento
    form_class = EventoForm
    template_name = "cadastro/evento_form.html"
    success_url = reverse_lazy("eventos")
    success_message = "Evento %(nome)s criado."

    def form_valid(self, form):
        form.instance.usuario = self.request.user
        return super().form_valid(form)


class EventoUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = Evento
    form_class = EventoForm
    template_name = "cadastro/evento_form.html"
    success_url = reverse_lazy("eventos")
    success_message = "Evento %(nome)s atualizado."


class EventoDeleteView(LoginRequiredMixin, SuccessMessageMixin, DeleteView):
    model = Evento
    template_name = "cadastro/confirmar_exclusao.html"
    success_url = reverse_lazy("eventos")
    success_message = "Evento excluído."
    extra_context = {"voltar": "eventos"}


# Relatórios


def _ultimos_meses(quantidade, hoje):
    """Lista de (ano, mês) dos últimos meses, do mais antigo ao atual."""
    meses = []
    ano, mes = hoje.year, hoje.month
    for _ in range(quantidade):
        meses.append((ano, mes))
        mes -= 1
        if mes == 0:
            ano, mes = ano - 1, 12
    return list(reversed(meses))


def _com_percentual(linhas, total):
    total = total or 1
    return [{**linha, "pct": round(linha["total"] * 100 / total)} for linha in linhas]


class RelatoriosView(LoginRequiredMixin, TemplateView):
    template_name = "cadastro/relatorios.html"

    def get_context_data(self, **kwargs):
        contexto = super().get_context_data(**kwargs)
        meses = _ultimos_meses(6, timezone.localdate())
        inicio = date(meses[0][0], meses[0][1], 1)

        por_mes = (
            Atendimento.objects.filter(data__gte=inicio)
            .annotate(mes=TruncMonth("data"))
            .values("mes")
            .annotate(total=Count("pk"))
        )
        totais = {(linha["mes"].year, linha["mes"].month): linha["total"] for linha in por_mes}
        maior = max(totais.values(), default=0)
        contexto["por_mes"] = _com_percentual(
            [
                {"rotulo": NOMES_MESES[mes - 1], "total": totais.get((ano, mes), 0)}
                for ano, mes in meses
            ],
            maior,
        )

        total_atendimentos = Atendimento.objects.count()
        contexto["total_atendimentos"] = total_atendimentos
        contexto["por_tipo"] = _com_percentual(
            Atendimento.objects.values(rotulo=F("tipo__nome"))
            .annotate(total=Count("pk"))
            .order_by("-total"),
            total_atendimentos,
        )

        rotulos_status = dict(Atendimento.Status.choices)
        contexto["por_status"] = _com_percentual(
            [
                {"rotulo": rotulos_status.get(linha["status"], linha["status"]), "total": linha["total"]}
                for linha in Atendimento.objects.values("status").annotate(total=Count("pk"))
            ],
            total_atendimentos,
        )

        total_pessoas = Pessoa.objects.count()
        contexto["total_pessoas"] = total_pessoas
        contexto["por_bairro"] = _com_percentual(
            Pessoa.objects.values(rotulo=F("bairro__nome"))
            .annotate(total=Count("pk"))
            .order_by("-total"),
            total_pessoas,
        )
        return contexto

