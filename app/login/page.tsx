import Image from "next/image";
import Header from "@/app/components/Header";
import LoginForm from "@/app/components/LoginForm";

export default function Login() {
  return (
    <main>
      <Header />
      <LoginForm />

      <div className="grid my-32 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left d-none">
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-white lg:col-span-2 lg:col-start-2">
          Giriş Yap
        </h1>
        <form className="mt-8 lg:col-span-2 lg:col-start-2">
          <input
            type="email"
            placeholder="E-posta adresi"
            className="w-full p-4 text-gray-800 bg-gray-100 rounded-lg dark:bg-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Şifre"
            className="w-full p-4 mt-4 text-gray-800 bg-gray-100 rounded-lg dark:bg-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="w-full p-4 mt-4 text-white rounded-lg bg-primary hover:underline">
            Giriş Yap
          </button>
          <hr className="my-8 border-gray-200 dark:border-gray-700" />
          <div className="flex justify-center gap-4 max-w-[380px] mx-auto">
            <button className="flex items-center justify-center p-4 rounded-lg bg-slate-100 w-14 h-14">
              <Image src="/google.svg" width={24} height={24} alt="Google" />
            </button>
            <button className="flex items-center justify-center p-4 rounded-lg bg-slate-100 w-14 h-14">
              <Image src="/x.svg" width={24} height={24} alt="X" />
            </button>
            <button className="flex items-center justify-center p-4 rounded-lg bg-slate-100 w-14 h-14">
              <Image
                src="/facebook.svg"
                width={25}
                height={25}
                alt="Facebook"
              />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
