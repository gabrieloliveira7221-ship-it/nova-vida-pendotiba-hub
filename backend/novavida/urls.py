from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

admin.site.site_header = "Nova Vida Pendotiba — Gestão"
admin.site.site_title = "Nova Vida Pendotiba"
admin.site.index_title = "Área reservada"

urlpatterns = [
    path("", RedirectView.as_view(url="/admin/", permanent=False)),
    path("admin/", admin.site.urls),
    path("api/", include("cadastro.urls")),
]
