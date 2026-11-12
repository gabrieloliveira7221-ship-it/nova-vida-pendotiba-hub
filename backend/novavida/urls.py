from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Nova Vida Pendotiba — Administração"
admin.site.site_title = "Nova Vida Pendotiba"
admin.site.index_title = "Administração do sistema"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("cadastro.urls")),
]
