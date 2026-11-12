import uuid

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Usuario",
            fields=[
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(blank=True, null=True, verbose_name="last login"),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={"unique": "A user with that username already exists."},
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                        max_length=150,
                        unique=True,
                        validators=[django.contrib.auth.validators.UnicodeUsernameValidator()],
                        verbose_name="username",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(blank=True, max_length=150, verbose_name="first name"),
                ),
                (
                    "last_name",
                    models.CharField(blank=True, max_length=150, verbose_name="last name"),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "id",
                    models.UUIDField(
                        db_column="id_usuario",
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("nome", models.CharField(blank=True, max_length=120, verbose_name="nome")),
                ("email", models.EmailField(max_length=254, unique=True, verbose_name="e-mail")),
                ("cargo", models.CharField(blank=True, max_length=60, verbose_name="cargo")),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "usuário",
                "verbose_name_plural": "usuários",
                "db_table": "usuario",
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="Bairro",
            fields=[
                ("id_bairro", models.BigAutoField(primary_key=True, serialize=False)),
                ("nome", models.CharField(max_length=80, unique=True, verbose_name="nome")),
            ],
            options={
                "db_table": "bairro",
                "ordering": ["nome"],
            },
        ),
        migrations.CreateModel(
            name="TipoAtendimento",
            fields=[
                ("id_tipo", models.BigAutoField(primary_key=True, serialize=False)),
                ("nome", models.CharField(max_length=80, unique=True, verbose_name="nome")),
            ],
            options={
                "verbose_name": "tipo de atendimento",
                "verbose_name_plural": "tipos de atendimento",
                "db_table": "tipo_atendimento",
                "ordering": ["nome"],
            },
        ),
        migrations.CreateModel(
            name="Pessoa",
            fields=[
                ("id_pessoa", models.BigAutoField(primary_key=True, serialize=False)),
                (
                    "nome_completo",
                    models.CharField(max_length=150, verbose_name="nome completo"),
                ),
                (
                    "data_nascimento",
                    models.DateField(blank=True, null=True, verbose_name="data de nascimento"),
                ),
                ("telefone", models.CharField(blank=True, max_length=20, verbose_name="telefone")),
                ("endereco", models.CharField(blank=True, max_length=200, verbose_name="endereço")),
                ("observacoes", models.TextField(blank=True, verbose_name="observações")),
                (
                    "data_cadastro",
                    models.DateField(auto_now_add=True, verbose_name="data de cadastro"),
                ),
                (
                    "bairro",
                    models.ForeignKey(
                        db_column="id_bairro",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="pessoas",
                        to="cadastro.bairro",
                    ),
                ),
            ],
            options={
                "db_table": "pessoa",
                "ordering": ["nome_completo"],
            },
        ),
        migrations.CreateModel(
            name="Atendimento",
            fields=[
                ("id_atendimento", models.BigAutoField(primary_key=True, serialize=False)),
                (
                    "data",
                    models.DateField(default=django.utils.timezone.localdate, verbose_name="data"),
                ),
                ("descricao", models.TextField(blank=True, verbose_name="descrição")),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("solicitado", "Solicitado"),
                            ("agendado", "Agendado"),
                            ("realizado", "Realizado"),
                            ("cancelado", "Cancelado"),
                        ],
                        default="agendado",
                        max_length=20,
                        verbose_name="situação",
                    ),
                ),
                (
                    "pessoa",
                    models.ForeignKey(
                        db_column="id_pessoa",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="atendimentos",
                        to="cadastro.pessoa",
                    ),
                ),
                (
                    "tipo",
                    models.ForeignKey(
                        db_column="id_tipo",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="atendimentos",
                        to="cadastro.tipoatendimento",
                        verbose_name="tipo de atendimento",
                    ),
                ),
                (
                    "usuario",
                    models.ForeignKey(
                        blank=True,
                        db_column="id_usuario",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="atendimentos",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="responsável",
                    ),
                ),
            ],
            options={
                "db_table": "atendimento",
                "ordering": ["-data", "-id_atendimento"],
            },
        ),
        migrations.CreateModel(
            name="Evento",
            fields=[
                ("id_evento", models.BigAutoField(primary_key=True, serialize=False)),
                ("nome", models.CharField(max_length=120, verbose_name="nome")),
                ("data", models.DateField(verbose_name="data")),
                ("horario", models.TimeField(blank=True, null=True, verbose_name="horário")),
                ("local", models.CharField(blank=True, max_length=120, verbose_name="local")),
                ("descricao", models.TextField(blank=True, verbose_name="descrição")),
                (
                    "presenca_prevista",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="presença prevista"
                    ),
                ),
                (
                    "usuario",
                    models.ForeignKey(
                        db_column="id_usuario",
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="eventos",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="criado por",
                    ),
                ),
            ],
            options={
                "db_table": "evento",
                "ordering": ["data", "horario"],
            },
        ),
    ]
