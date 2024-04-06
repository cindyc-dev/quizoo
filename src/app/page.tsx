import QuizooLogo from "~/components/QuizooLogo";
import RoomIdInput from "~/components/RoomIdInput";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#191733] to-[#03020D] text-white">
      <div className="container prose flex flex-col items-center justify-center px-4 py-16">
        <QuizooLogo />
        <h1 className="text-white">Quizoo</h1>
        <RoomIdInput />
      </div>
    </main>
  );
}
