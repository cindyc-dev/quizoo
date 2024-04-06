import QuizooLogo from "~/components/QuizooLogo";
import { Input } from "~/components/ui/input";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#191733] to-[#03020D] text-white">
      <div className="prose container flex flex-col items-center justify-center px-4 py-16">
        <QuizooLogo />
        <h1 className="text-white">Quizoo</h1>
        <Input type="text" placeholder="🏠 Room ID" className="max-w-xs" />
      </div>
    </main>
  );
}