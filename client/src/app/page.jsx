import Image from "next/image";
export default function Home() {
  return (
    <main className="h-screen w-screen">
      <header className="bg-gray-200 shadow-md py-4 h-45">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6 pl-10">
            <img
              src="https://coeta.ac.in/wp-content/uploads/2022/05/panjabrao.png"
              alt="logo-0"
              className="h-20"
            />
            <img
              src="https://coeta.ac.in/wp-content/uploads/2022/05/coeta_logo.png"
              alt="logo-1"
              className="h-20"
            />
            <img
              src="https://coeta.ac.in/wp-content/uploads/2022/05/SSES-logo-300x294.png"
              alt="logo-2"
              className="h-20"
            />
          </div>
          <div className="flex-auto ml-20 pl-12">
            <p className="text-xl font-bold ml-12 text-gray-500">
              Shri Shivaji Education Society, Amravati
            </p>
            <h1 className="text-2xl font-bold text-gray-600">
              College of Engineering and Technology, Akola
            </h1>
            <p className="text-xl font-bold ml-12 text-gray-500">
              Babhulgaon, Akola, Maharashtra-444104{" "}
            </p>
          </div>
          <div className="flex items-center space-x-6 pl-10">
            <img
              src="https://coeta.ac.in/wp-content/uploads/2022/05/naac-removebg-preview-300x197.png"
              alt="logo-3"
              className="h-20"
            />
            <img
              src="https://coeta.ac.in/wp-content/uploads/2022/05/estd1983-logo.png"
              alt="logo-4"
              className="h-20"
            />
          </div>
        </div>
      </header>
      <div className="mt-32 flex drop-shadow-2xl">
        <div className="w-1/2 justify-centre items-center bg-slate-100 rounded-3xl">
          <h1 className="text-5xl ml-10 font-semibold text-blue-800">
            College Community Portal
          </h1>
          <br />
          <p className="text-xl text-gray-500 ml-5 mr-3">
            A platform designed to facilitate communication and collaboration
            within the college community. It provides students with the ability
            to apply for various clubs and events, while enabling teachers to
            announce news and updates relevant to the college.
          </p>
        </div>
        <div className="w-1/2 mr-5">
          <img
            src="https://coeta.ac.in/wp-content/uploads/2022/05/Coeta-front.jpg"
            alt="clgBuilding"
            className="rounded-3xl"
          />
        </div>
      </div>
      <div className="mt-20 flex drop-shadow-2xl">
        <div className="w-1/2 ml-5">
          <img
            src="https://coeta.ac.in/wp-content/uploads/2022/07/CSE-4.jpg"
            alt="clgBuilding"
            className="rounded-3xl"
          />
        </div>
        <div className="w-1/2 justify-centre items-center bg-slate-100 rounded-3xl">
          <br />
          <br />
          <p className="text-2xl text-gray-500 ml-5 mr-3">
            College Community portal aims to spread awareness about the upcoming
            competitions and events,playing a valuable role in enhancing
            communication, collaboration, and engagement within the college
            community, ultimately contributing to a positive and vibrant campus
            environment.
          </p>
        </div>
      </div>
      <div className="mt-10 flex justify-around h-2/3 px-6">
        <div className="max-w-sm rounded-3xl overflow-hidden shadow-2xl ml-5 w-1/4">
          <img
            className="w-full"
            src="https://cdn-blog.novoresume.com/articles/extracurricular-activities/bg.png"
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Community clubs</div>
            <p className="text-gray-700 text-base">
              Be aware of different clubs present and enroll in them to enhance
              soft and hard skills.
            </p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #coding
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #music
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              #sports
            </span>
          </div>
        </div>
        <div className="max-w-sm rounded-3xl overflow-hidden shadow-2xl w-1/4">
          <img
            className="w-full"
            src="https://repowis2k23.blueinkcreations.com/wp-content/uploads/2023/02/cultural-event.jpg"
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Cultural Events</div>
            <p className="text-gray-700 text-base">
              Be aware and participate in upcoming Events in the college
            </p>
          </div>
        </div>
        <div className="max-w-sm rounded-3xl overflow-hidden shadow-2xl w-1/4">
          <img
            className="w-full"
            src="https://polarishighcounseling.weebly.com/uploads/7/3/7/9/73799061/2456382_orig.jpg"
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">
              Announcements by Staff and club Admins
            </div>
            <p className="text-gray-700 text-base">
              Be notified about upcoming events and other announcements by the
              staff and club admins.
            </p>
          </div>
        </div>
      </div>
      <br />
      <br />
      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <p className="text-white text-lg font-semibold">
            College of Engineering and Technology, Akola
          </p>
          <div className="mt-2 flex flex-col items-center">
            <p className="text-gray-300">Official website: www.coeta.ac.in </p>
            <p className="text-gray-300">Phone: (+91)7387523332</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
