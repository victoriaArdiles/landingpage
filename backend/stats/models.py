from django.db import models

class ProgramStats(models.Model):
    """Stores the real-time program statistics shown on the landing page."""
    pacientes_atendidos = models.IntegerField(default=0, verbose_name="Pacientes atendidos")
    medicos_aliados     = models.IntegerField(default=0, verbose_name="Médicos aliados")
    centros_de_salud    = models.IntegerField(default=0, verbose_name="Centros de salud")
    municipios          = models.IntegerField(default=0, verbose_name="Municipios alcanzados")
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Estadísticas del Programa"

    def __str__(self):
        return f"Stats actualizadas: {self.updated_at:%Y-%m-%d %H:%M}"
