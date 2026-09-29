from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("core", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="serviceinquiry",
            name="email_sent",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="serviceinquiry",
            name="object_details",
            field=models.TextField(blank=True, max_length=1500),
        ),
        migrations.AlterField(
            model_name="serviceinquiry",
            name="message",
            field=models.TextField(max_length=5000),
        ),
    ]
