from django import forms
from django.utils import timezone

from .models import Atendimento, Bairro, Evento, Pessoa, TipoAtendimento


class CampoData(forms.DateInput):
    input_type = "date"

    def __init__(self, attrs=None):
        super().__init__(attrs, format="%Y-%m-%d")


class CampoHora(forms.TimeInput):
    input_type = "time"

    def __init__(self, attrs=None):
        super().__init__(attrs, format="%H:%M")


class PessoaForm(forms.ModelForm):
    class Meta:
        model = Pessoa
        fields = [
            "nome_completo",
            "data_nascimento",
            "telefone",
            "bairro",
            "endereco",
            "observacoes",
        ]
        widgets = {
            "data_nascimento": CampoData(),
            "telefone": forms.TextInput(attrs={"placeholder": "(21) 99999-0000"}),
            "observacoes": forms.Textarea(attrs={"rows": 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["bairro"].empty_label = "Selecione o bairro"


class AtendimentoForm(forms.ModelForm):
    class Meta:
        model = Atendimento
        fields = ["pessoa", "tipo", "data", "status", "descricao"]
        widgets = {
            "data": CampoData(),
            "descricao": forms.Textarea(
                attrs={"rows": 4, "placeholder": "Detalhes do atendimento prestado"}
            ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["pessoa"].empty_label = "Selecione a pessoa"
        self.fields["tipo"].empty_label = "Selecione o tipo"


class EventoForm(forms.ModelForm):
    class Meta:
        model = Evento
        fields = ["nome", "data", "horario", "local", "presenca_prevista", "descricao"]
        labels = {"nome": "Nome do evento"}
        widgets = {
            "nome": forms.TextInput(attrs={"placeholder": "Ex.: Culto de Jovens"}),
            "data": CampoData(),
            "horario": CampoHora(),
            "local": forms.TextInput(attrs={"placeholder": "Ex.: Templo principal"}),
            "descricao": forms.Textarea(attrs={"rows": 4}),
        }


class SolicitacaoForm(forms.Form):
    """Formulário público em que a pessoa pede um atendimento à igreja."""

    nome_completo = forms.CharField(label="Nome completo", max_length=150)
    telefone = forms.CharField(
        label="Telefone para contato",
        max_length=20,
        widget=forms.TextInput(attrs={"placeholder": "(21) 99999-0000"}),
    )
    bairro = forms.ModelChoiceField(
        label="Bairro", queryset=Bairro.objects.all(), empty_label="Selecione o bairro"
    )
    tipo = forms.ModelChoiceField(
        label="Do que você precisa?",
        queryset=TipoAtendimento.objects.all(),
        empty_label="Selecione",
    )
    mensagem = forms.CharField(
        label="Conte um pouco da sua necessidade",
        required=False,
        max_length=1000,
        widget=forms.Textarea(attrs={"rows": 4}),
    )

    def salvar(self):
        dados = self.cleaned_data
        pessoa = Pessoa.objects.filter(
            nome_completo__iexact=dados["nome_completo"].strip(),
            telefone=dados["telefone"].strip(),
        ).first()
        if pessoa is None:
            pessoa = Pessoa.objects.create(
                nome_completo=dados["nome_completo"].strip(),
                telefone=dados["telefone"].strip(),
                bairro=dados["bairro"],
            )
        return Atendimento.objects.create(
            pessoa=pessoa,
            tipo=dados["tipo"],
            data=timezone.localdate(),
            descricao=dados["mensagem"],
            status=Atendimento.Status.SOLICITADO,
        )
