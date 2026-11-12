from django.contrib.auth import views as auth_views
from django.urls import path

from . import views

urlpatterns = [
    # Área pública
    path("", views.AgendaView.as_view(), name="agenda"),
    path("solicitar-atendimento/", views.SolicitarAtendimentoView.as_view(), name="solicitar"),
    path(
        "entrar/",
        auth_views.LoginView.as_view(redirect_authenticated_user=True),
        name="entrar",
    ),
    path("sair/", auth_views.LogoutView.as_view(), name="sair"),
    # Gestão
    path("gestao/", views.PainelView.as_view(), name="painel"),
    path("gestao/pessoas/", views.PessoaListView.as_view(), name="pessoas"),
    path("gestao/pessoas/nova/", views.PessoaCreateView.as_view(), name="pessoa_nova"),
    path("gestao/pessoas/<int:pk>/", views.PessoaDetailView.as_view(), name="pessoa_detalhe"),
    path(
        "gestao/pessoas/<int:pk>/editar/",
        views.PessoaUpdateView.as_view(),
        name="pessoa_editar",
    ),
    path(
        "gestao/pessoas/<int:pk>/excluir/",
        views.PessoaDeleteView.as_view(),
        name="pessoa_excluir",
    ),
    path("gestao/atendimentos/", views.AtendimentoListView.as_view(), name="atendimentos"),
    path(
        "gestao/atendimentos/novo/",
        views.AtendimentoCreateView.as_view(),
        name="atendimento_novo",
    ),
    path(
        "gestao/atendimentos/<int:pk>/editar/",
        views.AtendimentoUpdateView.as_view(),
        name="atendimento_editar",
    ),
    path(
        "gestao/atendimentos/<int:pk>/excluir/",
        views.AtendimentoDeleteView.as_view(),
        name="atendimento_excluir",
    ),
    path(
        "gestao/atendimentos/<int:pk>/<slug:acao>/",
        views.AtendimentoSituacaoView.as_view(),
        name="atendimento_situacao",
    ),
    path("gestao/eventos/", views.EventoListView.as_view(), name="eventos"),
    path("gestao/eventos/novo/", views.EventoCreateView.as_view(), name="evento_novo"),
    path(
        "gestao/eventos/<int:pk>/editar/",
        views.EventoUpdateView.as_view(),
        name="evento_editar",
    ),
    path(
        "gestao/eventos/<int:pk>/excluir/",
        views.EventoDeleteView.as_view(),
        name="evento_excluir",
    ),
    path("gestao/relatorios/", views.RelatoriosView.as_view(), name="relatorios"),
]
