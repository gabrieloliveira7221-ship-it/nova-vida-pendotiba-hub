"""
Modelos do sistema Nova Vida Pendotiba.

Seguem o modelo lógico do trabalho: nomes de tabelas (db_table) e de colunas
(db_column) iguais aos do diagrama, para o banco gerado pelo Django bater com o
documentado.
"""
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class Usuario(AbstractUser):
    """Quem usa a área reservada (pastores, diáconos, secretaria)."""

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, db_column="id_usuario"
    )
    nome = models.CharField("nome", max_length=120, blank=True)
    email = models.EmailField("e-mail", unique=True)
    cargo = models.CharField("cargo", max_length=60, blank=True)

    class Meta:
        db_table = "usuario"
        verbose_name = "usuário"
        verbose_name_plural = "usuários"

    def __str__(self):
        return self.nome or self.get_full_name() or self.username


class Bairro(models.Model):
    id_bairro = models.BigAutoField(primary_key=True)
    nome = models.CharField("nome", max_length=80, unique=True)

    class Meta:
        db_table = "bairro"
        ordering = ["nome"]

    def __str__(self):
        return self.nome


class TipoAtendimento(models.Model):
    id_tipo = models.BigAutoField(primary_key=True)
    nome = models.CharField("nome", max_length=80, unique=True)

    class Meta:
        db_table = "tipo_atendimento"
        ordering = ["nome"]
        verbose_name = "tipo de atendimento"
        verbose_name_plural = "tipos de atendimento"

    def __str__(self):
        return self.nome


class Pessoa(models.Model):
    """Pessoa atendida ou acompanhada pela igreja."""

    id_pessoa = models.BigAutoField(primary_key=True)
    nome_completo = models.CharField("nome completo", max_length=150)
    data_nascimento = models.DateField("data de nascimento", null=True, blank=True)
    telefone = models.CharField("telefone", max_length=20, blank=True)
    endereco = models.CharField("endereço", max_length=200, blank=True)
    observacoes = models.TextField("observações", blank=True)
    data_cadastro = models.DateField("data de cadastro", auto_now_add=True)
    bairro = models.ForeignKey(
        Bairro, on_delete=models.PROTECT, db_column="id_bairro", related_name="pessoas"
    )

    class Meta:
        db_table = "pessoa"
        ordering = ["nome_completo"]

    def __str__(self):
        return self.nome_completo


class Atendimento(models.Model):
    class Status(models.TextChoices):
        AGENDADO = "agendado", "Agendado"
        REALIZADO = "realizado", "Realizado"
        CANCELADO = "cancelado", "Cancelado"

    id_atendimento = models.BigAutoField(primary_key=True)
    data = models.DateField("data", default=timezone.localdate)
    descricao = models.TextField("descrição", blank=True)
    status = models.CharField(
        "status", max_length=20, choices=Status.choices, default=Status.AGENDADO
    )
    pessoa = models.ForeignKey(
        Pessoa, on_delete=models.CASCADE, db_column="id_pessoa", related_name="atendimentos"
    )
    tipo = models.ForeignKey(
        TipoAtendimento,
        on_delete=models.PROTECT,
        db_column="id_tipo",
        related_name="atendimentos",
        verbose_name="tipo",
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column="id_usuario",
        related_name="atendimentos",
        verbose_name="responsável",
    )

    class Meta:
        db_table = "atendimento"
        ordering = ["-data"]

    def __str__(self):
        return f"{self.tipo} — {self.pessoa} ({self.data:%d/%m/%Y})"


class Evento(models.Model):
    id_evento = models.BigAutoField(primary_key=True)
    nome = models.CharField("nome", max_length=120)
    data = models.DateField("data")
    horario = models.TimeField("horário", null=True, blank=True)
    local = models.CharField("local", max_length=120, blank=True)
    descricao = models.TextField("descrição", blank=True)
    presenca_prevista = models.PositiveIntegerField("presença prevista", null=True, blank=True)
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column="id_usuario",
        related_name="eventos",
        verbose_name="criado por",
    )

    class Meta:
        db_table = "evento"
        ordering = ["data", "horario"]

    def __str__(self):
        return f"{self.nome} ({self.data:%d/%m/%Y})"
