"""
Cadastra os dados iniciais (bairros e tipos de atendimento).
Uso: python manage.py popular_dados
Pode rodar mais de uma vez sem duplicar nada.
"""
from django.core.management.base import BaseCommand

from cadastro.models import Bairro, TipoAtendimento

BAIRROS = ["Pendotiba", "Largo da Batalha", "Maceió", "Badu", "Sapê", "Matapaca"]
TIPOS = ["Cesta básica", "Aconselhamento", "Visita", "Oração", "Encaminhamento"]


class Command(BaseCommand):
    help = "Cadastra bairros e tipos de atendimento iniciais."

    def handle(self, *args, **options):
        novos_bairros = sum(Bairro.objects.get_or_create(nome=nome)[1] for nome in BAIRROS)
        novos_tipos = sum(TipoAtendimento.objects.get_or_create(nome=nome)[1] for nome in TIPOS)
        self.stdout.write(
            self.style.SUCCESS(
                f"Pronto: {novos_bairros} bairro(s) e {novos_tipos} tipo(s) de atendimento novos."
            )
        )
