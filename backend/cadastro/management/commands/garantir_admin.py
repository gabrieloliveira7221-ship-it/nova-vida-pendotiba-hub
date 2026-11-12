import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = (
        "Cria o administrador a partir das variáveis ADMIN_USUARIO, ADMIN_SENHA "
        "e ADMIN_EMAIL, caso ele ainda não exista."
    )

    def handle(self, *args, **options):
        usuario = os.environ.get("ADMIN_USUARIO")
        senha = os.environ.get("ADMIN_SENHA")
        if not usuario or not senha:
            self.stdout.write("ADMIN_USUARIO/ADMIN_SENHA não definidos; nada a fazer.")
            return

        Usuario = get_user_model()
        if Usuario.objects.filter(username=usuario).exists():
            self.stdout.write(f"Administrador '{usuario}' já existe.")
            return

        Usuario.objects.create_superuser(
            username=usuario,
            email=os.environ.get("ADMIN_EMAIL") or f"{usuario}@novavida.local",
            password=senha,
            nome=os.environ.get("ADMIN_NOME", usuario),
            cargo="Administrador",
        )
        self.stdout.write(self.style.SUCCESS(f"Administrador '{usuario}' criado."))
