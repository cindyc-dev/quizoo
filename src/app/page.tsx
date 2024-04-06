import PageLayout from "~/components/PageLayout";
import QuizooLogo from "~/components/QuizooLogo";
import RoomIdInput from "~/components/RoomIdInput";

export default async function Home() {
  const handleJoin = async () => {};

  return (
    <PageLayout className="justify-center">
      <QuizooLogo />
      <h1 className="text-primary-content">Quizoo</h1>
      <RoomIdInput handleSubmit={handleJoin} />
    </PageLayout>
  );
}
