from datetime import timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Atendimento, Bairro, Evento, Pessoa, TipoAtendimento, Usuario


class BaseTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.usuario = Usuario.objects.create_user(
            username="secretaria", email="secretaria@teste.com", password="senha-forte-123"
        )
        cls.bairro = Bairro.objects.create(nome="Pendotiba")
        cls.tipo = TipoAtendimento.objects.create(nome="Cesta básica")
        cls.pessoa = Pessoa.objects.create(nome_completo="Maria da Silva", bairro=cls.bairro)


class AcessoTests(BaseTestCase):
    def test_gestao_exige_login(self):
        resposta = self.client.get(reverse("pessoas"))
        self.assertRedirects(resposta, f"{reverse('entrar')}?next={reverse('pessoas')}")

    def test_agenda_publica_mostra_so_eventos_futuros(self):
        hoje = timezone.localdate()
        Evento.objects.create(nome="Culto de Jovens", data=hoje, usuario=self.usuario)
        Evento.objects.create(
            nome="Bazar antigo", data=hoje - timedelta(days=7), usuario=self.usuario
        )
        resposta = self.client.get(reverse("agenda"))
        self.assertContains(resposta, "Culto de Jovens")
        self.assertNotContains(resposta, "Bazar antigo")


class PessoaTests(BaseTestCase):
    def setUp(self):
        self.client.force_login(self.usuario)

    def test_cadastrar_pessoa(self):
        self.client.post(
            reverse("pessoa_nova"),
            {"nome_completo": "João Pereira", "bairro": self.bairro.pk},
        )
        self.assertTrue(Pessoa.objects.filter(nome_completo="João Pereira").exists())

    def test_busca_por_nome(self):
        Pessoa.objects.create(nome_completo="Carlos Souza", bairro=self.bairro)
        resposta = self.client.get(reverse("pessoas"), {"q": "maria"})
        self.assertContains(resposta, "Maria da Silva")
        self.assertNotContains(resposta, "Carlos Souza")


class AtendimentoTests(BaseTestCase):
    def setUp(self):
        self.client.force_login(self.usuario)

    def test_registrar_atendimento_grava_responsavel(self):
        self.client.post(
            reverse("atendimento_novo"),
            {
                "pessoa": self.pessoa.pk,
                "tipo": self.tipo.pk,
                "data": timezone.localdate().isoformat(),
                "status": "agendado",
            },
        )
        atendimento = Atendimento.objects.get()
        self.assertEqual(atendimento.usuario, self.usuario)

    def test_cancelar_atendimento(self):
        atendimento = Atendimento.objects.create(
            pessoa=self.pessoa, tipo=self.tipo, usuario=self.usuario
        )
        self.client.post(reverse("atendimento_situacao", args=[atendimento.pk, "cancelar"]))
        atendimento.refresh_from_db()
        self.assertEqual(atendimento.status, Atendimento.Status.CANCELADO)

    def test_historico_da_pessoa(self):
        Atendimento.objects.create(pessoa=self.pessoa, tipo=self.tipo, usuario=self.usuario)
        resposta = self.client.get(reverse("pessoa_detalhe", args=[self.pessoa.pk]))
        self.assertContains(resposta, "Cesta básica")


class SolicitacaoTests(BaseTestCase):
    def test_solicitacao_publica_cria_atendimento_solicitado(self):
        self.client.post(
            reverse("solicitar"),
            {
                "nome_completo": "Ana Lima",
                "telefone": "21999990000",
                "bairro": self.bairro.pk,
                "tipo": self.tipo.pk,
                "mensagem": "Preciso de ajuda com alimentos.",
            },
        )
        atendimento = Atendimento.objects.get()
        self.assertEqual(atendimento.status, Atendimento.Status.SOLICITADO)
        self.assertIsNone(atendimento.usuario)
        self.assertEqual(atendimento.pessoa.nome_completo, "Ana Lima")
