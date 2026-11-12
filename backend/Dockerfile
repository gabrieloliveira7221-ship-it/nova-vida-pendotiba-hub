FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN DJANGO_DEBUG=0 DJANGO_SECRET_KEY=coleta-estaticos python manage.py collectstatic --noinput

EXPOSE 8000

# Ao iniciar: aplica as migrações, cadastra os dados iniciais, garante o administrador e sobe o servidor.
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py popular_dados && python manage.py garantir_admin && gunicorn novavida.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2"]
