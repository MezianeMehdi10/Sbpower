from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("core", "0002_serviceinquiry_email_sent_and_more")]

    operations = [
        migrations.RemoveField(
            model_name="serviceinquiry",
            name="email_sent",
        ),
        migrations.AlterField(
            model_name="serviceinquiry",
            name="customer_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("private", "Privatkunde"),
                    ("business", "Unternehmen / Gewerbe"),
                ],
                default="",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="serviceinquiry",
            name="email",
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AlterField(
            model_name="serviceinquiry",
            name="message",
            field=models.TextField(blank=True, max_length=5000),
        ),
        migrations.AddField(
            model_name="serviceinquiry",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
