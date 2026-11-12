"""
API em JSON (só leitura) para relatórios e consultas.
Exige login: entre primeiro pelo /admin/.
"""
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.http import JsonResponse
from django.utils import timezone

from .models import Atendimento, Evento, Pessoa


@login_required
def resumo(request):
    """Números do painel/relatórios: totais, atendimentos por status e tipo, próximos eventos."""
    hoje = timezone.localdate()
    por_status = Atendimento.objects.values("status").annotate(total=Count("pk")).order_by("status")
    por_tipo = (
        Atendimento.objects.values("tipo__nome").annotate(total=Count("pk")).order_by("-total")
    )
    proximos = Evento.objects.filter(data__gte=hoje).order_by("data", "horario")[:5]

    return JsonResponse(
        {
            "total_pessoas": Pessoa.objects.count(),
            "total_atendimentos": Atendimento.objects.count(),
            "atendimentos_por_status": {item["status"]: item["total"] for item in por_status},
            "atendimentos_por_tipo": [
                {"tipo": item["tipo__nome"], "total": item["total"]} for item in por_tipo
            ],
            "proximos_eventos": [
                {
                    "nome": evento.nome,
                    "data": evento.data.isoformat(),
                    "horario": evento.horario.strftime("%H:%M") if evento.horario else None,
                    "local": evento.local,
                }
                for evento in proximos
            ],
        },
        json_dumps_params={"ensure_ascii": False},
    )


@login_required
def pessoas(request):
    """Lista de pessoas com busca por nome (?q=) e filtro por bairro (?bairro=)."""
    consulta = Pessoa.objects.select_related("bairro")
    if termo := request.GET.get("q"):
        consulta = consulta.filter(nome_completo__icontains=termo)
    if bairro := request.GET.get("bairro"):
        consulta = consulta.filter(bairro__nome__iexact=bairro)

    return JsonResponse(
        {
            "pessoas": [
                {
                    "id": pessoa.pk,
                    "nome_completo": pessoa.nome_completo,
                    "telefone": pessoa.telefone,
                    "bairro": pessoa.bairro.nome,
                    "data_cadastro": pessoa.data_cadastro.isoformat(),
                }
                for pessoa in consulta
            ]
        },
        json_dumps_params={"ensure_ascii": False},
    )
