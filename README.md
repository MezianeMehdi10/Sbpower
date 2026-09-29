# SB Power Gebäudereinigung

Site officiel multilingue de SB Power, entreprise de nettoyage à Bremen. Le projet utilise Next.js 16 (App Router, TypeScript et CSS global) pour le frontend et Django REST Framework avec MySQL pour le backend.

## Fonctionnalités

- Pages `Startseite`, `Leistungen`, `Kontakt`, `Impressum` et `Datenschutz`
- Contenu en allemand, anglais, français, russe et arabe
- Navigation responsive et sélection de langue mémorisée dans le navigateur
- Formulaire de devis relié à l'API Django
- Enregistrement des demandes dans l'administration Django
- Notification SMTP optionnelle

## Configuration

Frontend, dans `frontend/.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Backend, dans `backend/.env` :

```env
DJANGO_SECRET_KEY=change-me-in-production
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
DATABASE_NAME=sbpower
DATABASE_USER=sbpower_user
DATABASE_PASSWORD=your-local-password
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
```

Pour les notifications e-mail, renseigner également `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, `DEFAULT_FROM_EMAIL` et `INQUIRY_NOTIFICATION_EMAIL`. Sans SMTP, les demandes sont tout de même enregistrées dans MySQL.

## Lancer le backend

```powershell
cd "D:\Sb Power\backend"
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

Si l'activation PowerShell est bloquée :

```powershell
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py runserver
```

API : `http://127.0.0.1:8000/api/`

Administration personnalisée : `http://localhost:3000/admin/login`

## Lancer le frontend

Dans un second terminal :

```powershell
cd "D:\Sb Power\frontend"
npm install
npm run dev
```

Site : `http://localhost:3000` (ou le port suivant si 3000 est occupé).

## Vérification

```powershell
cd "D:\Sb Power\frontend"
npm run lint
npm run build

cd "D:\Sb Power\backend"
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py test
```

## MySQL local

La base locale attendue est `sbpower`, avec l'utilisateur applicatif `sbpower_user`. Le backend ne revient pas automatiquement vers SQLite: les variables `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST` et `DATABASE_PORT` doivent être présentes dans `backend/.env`.

Créer ou vérifier la base localement:

```sql
CREATE DATABASE IF NOT EXISTS sbpower
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON sbpower.* TO 'sbpower_user'@'localhost';
GRANT ALL PRIVILEGES ON sbpower.* TO 'sbpower_user'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Après configuration:

```powershell
cd "D:\Sb Power\backend"
.\.venv\Scripts\python.exe manage.py makemigrations --check
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py createsuperuser
```

## Future mise en ligne Octenium

Sur Octenium, la migration MySQL devra suivre ces étapes:

1. Créer une base MySQL dans cPanel.
2. Créer un utilisateur MySQL.
3. Donner à cet utilisateur les droits sur la base.
4. Définir les valeurs serveur `.env`: `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST`, `DATABASE_PORT`.
5. Installer les dépendances depuis `requirements.txt`.
6. Lancer `python manage.py migrate`.
7. Créer l'admin de production avec `python manage.py createsuperuser`.
8. Tester le flux Contact -> MySQL -> Admin personnalisé.

Ne jamais mettre les mots de passe réels dans le dépôt.

## Avant la production

Remplacer les placeholders de téléphone, e-mail, Instagram, TikTok, adresse et informations légales. Configurer un secret Django fort, désactiver le mode debug, définir les domaines autorisés et faire valider les pages légales.
