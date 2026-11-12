from django.urls import path

from . import views

urlpatterns = [
    path("resumo/", views.resumo, name="resumo"),
    path("pessoas/", views.pessoas, name="pessoas"),
]
