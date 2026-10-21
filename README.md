# YabaGroup Gestión Documental 📁⚖️🛡️

Plataforma integral y modular de gestión documental y soporte para asesorías técnicas y corporativas:
* **Seguridad y Salud en el Trabajo (SG-SST)**
* **Servicios Jurídicos y Legal Tech**
* **Diseño e Ingeniería Estructural**
* **Gestión de Calidad (ISO 9001)**
* **Gestión Ambiental**
* **Consultoría Estratégica Empresarial**

---

## 🚀 Puesta en Marcha Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir en el navegador: `http://localhost:3000`

---

## 🌐 Despliegue en Vercel (Producción)

1. Sube este proyecto a tu repositorio de GitHub (o usa el Vercel CLI):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - YabaGroup Gestión Documental"
   git remote add origin https://github.com/TU_USUARIO/yabagroup-gestion-documental.git
   git push -u origin main
   ```
2. Entra a [Vercel](https://vercel.com) y dale a **Add New > Project**.
3. Importa tu repositorio de GitHub.
4. En **Build and Output Settings**, Vercel detectará automáticamente `Vite`.
5. Si ya tienes Supabase, agrega en **Environment Variables**:
   * `VITE_SUPABASE_URL`: Tu URL de proyecto Supabase
   * `VITE_SUPABASE_ANON_KEY`: Tu Anon Key pública de Supabase
6. Haz clic en **Deploy**. ¡Tu proyecto estará en línea en un minuto con tu URL personalizada `https://yabagroup-gestion-documental.vercel.app`!

---

## 🗄️ Conexión con Base de Datos Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al menú **SQL Editor** en Supabase.
3. Copia todo el contenido de [`supabase/schema.sql`](./supabase/schema.sql) y dale a **Run**.
4. Ve al menú **Storage** y crea dos buckets:
   * `documentos-clientes`
   * `entregables-yabagroup`
5. Copia tu URL y anon key de Supabase a tu archivo `.env`.

*Nota: La plataforma cuenta con un modo demo interactivo con persistencia local que te permite presentar y probar todas las funcionalidades incluso antes de conectar Supabase.*
