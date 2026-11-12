"""
Painel administrativo: é a "área reservada" do sistema no Django.
Cobre os requisitos de cadastrar, editar, excluir, buscar e filtrar.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Atendimento, Bairro, Evento, Pessoa, TipoAtendimento, Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ("username", "nome", "email", "cargo", "is_active")
    search_fields = ("username", "nome", "email")
    fieldsets = UserAdmin.fieldsets + (("Dados da igreja", {"fields": ("nome", "cargo")}),)
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Dados da igreja", {"fields": ("nome", "email", "cargo")}),
    )


@admin.register(Bairro)
class BairroAdmin(admin.ModelAdmin):
    search_fields = ("nome",)


@admin.register(TipoAtendimento)
class TipoAtendimentoAdmin(admin.ModelAdmin):
    search_fields = ("nome",)


class AtendimentoInline(admin.TabularInline):
    """Histórico de atendimentos dentro da ficha da pessoa."""

    model = Atendimento
    extra = 0
    fields = ("data", "tipo", "status", "descricao", "usuario")
    readonly_fields = ("usuario",)


@admin.register(Pessoa)
class PessoaAdmin(admin.ModelAdmin):
    list_display = ("nome_completo", "telefone", "bairro", "data_cadastro")
    list_filter = ("bairro",)
    search_fields = ("nome_completo", "telefone")
    date_hierarchy = "data_cadastro"
    inlines = [AtendimentoInline]

    def save_formset(self, request, form, formset, change):
        # Atendimento criado pela ficha da pessoa fica no nome de quem está logado.
        objetos = formset.save(commit=False)
        for objeto in objetos:
            if isinstance(objeto, Atendimento) and not objeto.usuario_id:
                objeto.usuario = request.user
            objeto.save()
        for objeto in formset.deleted_objects:
            objeto.delete()
        formset.save_m2m()


@admin.register(Atendimento)
class AtendimentoAdmin(admin.ModelAdmin):
    list_display = ("data", "pessoa", "tipo", "usuario", "status")
    list_filter = ("status", "tipo", "data")
    search_fields = ("pessoa__nome_completo", "descricao")
    date_hierarchy = "data"
    autocomplete_fields = ("pessoa",)
    exclude = ("usuario",)
    actions = ["marcar_realizado", "marcar_cancelado"]

    def save_model(self, request, obj, form, change):
        if not obj.usuario_id:
            obj.usuario = request.user
        super().save_model(request, obj, form, change)

    @admin.action(description="Marcar como realizado")
    def marcar_realizado(self, request, queryset):
        queryset.update(status=Atendimento.Status.REALIZADO)

    @admin.action(description="Marcar como cancelado")
    def marcar_cancelado(self, request, queryset):
        queryset.update(status=Atendimento.Status.CANCELADO)


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ("nome", "data", "horario", "local", "presenca_prevista")
    list_filter = ("data",)
    search_fields = ("nome", "local")
    date_hierarchy = "data"
    exclude = ("usuario",)

    def save_model(self, request, obj, form, change):
        if not obj.usuario_id:
            obj.usuario = request.user
        super().save_model(request, obj, form, change)
