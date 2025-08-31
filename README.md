# ✨ Mystery Message

Mystery Message is a **full-stack anonymous social messaging platform** built with the latest **Next.js 14 App Router**. Inspired by apps like **Qooh.me**, it allows users to receive anonymous messages and engage with **AI-generated conversation starters** in a fun, clean, and secure environment.

🔗 **Live Demo:** [mystry-message-opal.vercel.app](https://mystry-message-opal.vercel.app)

---

## 🚀 Features

* 🔒 **Anonymous Messaging** – Anyone can send you messages without revealing their identity.
* 📧 **Email Verification** – Secure signup/login with **resend for email verification**.
* 🤖 **AI Conversation Starters** – Get fun and engaging prompts powered by AI.
* 🖤 **Modern UI/UX** – Built with a **clean, minimal design** for a smooth experience.
* ⚡ **Next.js 14 App Router** – Full-stack capabilities with server actions.
* 📱 **Responsive Design** – Works seamlessly across mobile, tablet, and desktop.
* 🛡️ **Validation with Zod** – Safe and type-checked input handling.

---

## 🛠️ Tech Stack

**Framework & UI:**

* [Next.js 14 (App Router)](https://nextjs.org/) – Full-stack framework
* [React](https://react.dev/) – Component-based UI
* [Tailwind CSS](https://tailwindcss.com/) – Styling and responsiveness
* [Shadcn UI](https://ui.shadcn.com/) – Pre-built UI components
* [TypeScript](https://www.typescriptlang.org/) – Type safety

**Auth & Email:**

* [Next-auth](https://next-auth.js.org/) – Authentication
* [Resend](https://resend.com/) – Email verification & notifications

**Validation:**

* [Zod](https://zod.dev/) – Schema validation

**AI Integration:**

* [Open Router for API](https://openrouter.ai/) – AI conversation starters

**Hosting:**

* [Vercel](https://vercel.com/) – Hosting & Deployment

---

## 📂 Project Structure

```
mystery-message/
│── app/              # Next.js App Router pages & layouts
│── components/       # UI components (buttons, modals, forms, etc.)
│── lib/              # Utilities, email configs, validation schemas
│── public/           # Static assets
│── package.json      # Project dependencies
│── README.md         # Project documentation
```

---

## ⚙️ Getting Started

Follow these steps to run Mystery Message locally:

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AnuragGupta181/next-mystry_message.git
cd mystery-message
```

### 2️⃣ Install dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Configure environment variables

Create a `.env.local` file in the root and add required keys:

```env
RESEND_API_KEY=your_resend_api_key
OPENROUTER_API_KEY=your_ai_api_key
MONGODB_URI=your_connection_string
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

**Or** use these **sample env** keys

```.env.sample
MONGODB_URI = "mongodb://anu:123@mycluster-shard-00-00.gjelc.mongodb.net:27017,mycluster-shard-00-01.gjelc.mongodb.net:27017,mycluster-shard-00-02.gjelc.mongodb.net:27017/mstrymessage?replicaSet=atlas-sq1glq-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=MyCluster"

RESEND_API_KEY = "re_FLRgj7hy_MDWXiYrPAZLwZB89yfvzMzSJ"

NEXTAUTH_SECRET =papa

GOOGLE_CLIENT_ID = "266747673256-nnpgqlgtfbkl7m9oidk6vkbq9sln2msv.apps.googleusercontent.com"

GOOGLE_CLIENT_SECRET = "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"

GEMINI_API_KEY = "AIzaSyD8h2swzjS5TZkXhWf26flI4_anQ2vm0No"

NEXTAUTH_URL=http://localhost:3000

OPENROUTER_API_KEY=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
```



### 4️⃣ Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🚀

---

## 📸 Screenshots

### 🏠 Homepage  
![Homepage](./public/1.png)  

### Login Screen
![Login](./public/2.png)  

### User Dashboard
![Dashboard](./public/3.png)  

### Suggesting Message 
![Message](./public/4.png)  

---

## 🌍 Deployment

The project is deployed on **Vercel**.
Push to the `main` branch → auto deploy to production.

---

## 🤝 Contributing

Contributions are welcome! 🎉
If you’d like to improve Mystery Message, feel free to:

1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Open a pull request

---


## 💡 Inspiration

Mystery Message was inspired by anonymous Q\&A platforms like **Qooh.me**, but with a modern twist: **AI-powered fun, email verification, and safe interactions**.
