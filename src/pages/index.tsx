import { type Leads, type Props } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";

const HomePage: any = (props: Props) => {
  const [leads, setLeads] = useState<Array<any>>();
  const [lead, setLead] = useState<Leads | undefined>();
  const [comment, setComment] = useState<string>("");
  const [emailPersonalization, setEmailPersonalization] = useState<
    string | undefined
  >("");
  const [count, setCount] = useState<number>(0);

  const handleCommentChange = (e: any) => {
    setComment(e?.target?.value as string);
  };

  const handleEmailPersonalizationChange = (e: any) => {
    setEmailPersonalization(e?.target?.value as string);
  };

  const fetchLeads = async (): Promise<void> => {
    try {
      const response = await axios.get("/api/leads");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const leads = response.data as Array<Leads>;
      setLeads(leads);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLeads();
  }, []);

  useEffect(() => {
    if (leads) {
      setLead(leads[count || 0]);
    }
  }, [leads]);

  useEffect(() => {
    setEmailPersonalization(lead?.emailPersonalization as string);
    setComment(lead?.comment as string);
  }, [lead]);

  useEffect(() => {
    if (leads) {
      setLead(leads[count]);
    }
  }, [count]);

  const onChoiceClick = async (e: any, choice: string): Promise<void> => {
    if (
      confirm(
        `Are you sure you want to ${
          choice === "REJECTED" ? "reject" : "approve"
        } this lead`
      ) === true
    ) {
      await updateLead({ status: choice });
    }
  };

  const updateLead = async (data: any): Promise<void> => {
    if (lead?.id) {
      try {
        await axios.post(`/api/leads/${lead.id}`, data);
        await fetchLeads();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onRequestChanges = async (): Promise<void> => {
    await updateLead({ comment, emailPersonalization });
    alert("Changes made successfully!");
  };

  if (leads && lead) {
    return (
      <>
        <Head>
          <title>Lead approval application</title>
        </Head>
        <div className="rounded-xl bg-slate-100 pb-2 dark:bg-slate-800 md:flex">
          <img
            className="mx-auto h-24 w-24 rounded-full p-4 md:mx-0 md:h-auto md:w-40 md:rounded-full"
            src="/profile.svg"
            alt=""
            width="384"
            height="512"
          />
          <div className="md:p-8">
            <div className=" mx-auto table font-medium">
              <div className="flex">
                <img className="h-5 w-5" src="/person.svg" />
                <div className="text-slate-700 dark:text-slate-700">
                  {lead?.name}
                </div>
              </div>
              <div className="flex">
                <img className="h-5 w-5" src="/designation.svg" />
                <div className="text-slate-700 dark:text-slate-500">
                  {lead?.designation}
                </div>
              </div>
              <div className="flex">
                <img className="h-5 w-5" src="/company.svg" />
                <div className="text-slate-700 dark:text-slate-500">
                  {lead?.company}
                </div>
              </div>
              <div className="flex">
                <img className="h-5 w-5" src="/location.svg" />
                <div className="text-slate-700 dark:text-slate-500">
                  {lead?.location}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start md:px-4">
          {lead.status ? (
            <div>
              <h2 className="my-2 text-xl font-bold text-gray-900 dark:text-white md:text-xl">
                Status: 
                <span
                  className={
                    lead.status === "APPROVED"
                      ? "mx-1 text-green-500"
                      : "mx-1 text-red-500"
                  }
                >
                  {lead.status}
                </span>
              </h2>
            </div>
          ) : null}
          <div>
            <h2 className="my-2 text-xl font-bold text-gray-900 dark:text-white md:text-xl">
              About
            </h2>
            <p className="lg:text-l text-base font-normal text-slate-700 dark:text-gray-400">
              {lead.about}
            </p>
          </div>
          <div className="md:container">
            <h2 className="my-2 text-xl font-extrabold text-gray-900 dark:text-white md:text-xl">
              Email personalization
            </h2>
            <textarea
              id="email"
              rows={2}
              onChange={handleEmailPersonalizationChange}
              value={emailPersonalization}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 md:w-1/2"
              placeholder="Email personalization goes here..."
            ></textarea>
          </div>
          <div className="md:container">
            <h2 className="my-2 text-xl font-extrabold text-gray-900 dark:text-white md:text-xl">
              Leave a comment
            </h2>
            <textarea
              id="message"
              rows={2}
              onChange={handleCommentChange}
              value={comment}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 md:w-1/2"
              placeholder="Write your comments here..."
            ></textarea>
          </div>
        </div>
        <div className="flex items-center justify-center pt-4 md:flex-1 md:items-start md:justify-normal">
          <button
            onClick={async (e): Promise<any> => {
              await onRequestChanges();
            }}
            className="bg-white-500 mx-1 mt-3 border border-amber-600 p-3 py-2 font-bold text-amber-600 hover:bg-yellow-100"
          >
            Request Ammendments
          </button>
        </div>

        <div className="flex items-center justify-center pt-4 md:flex-1 md:items-start md:justify-normal">
          <button
            disabled={lead.status === "REJECTED"}
            onClick={async (e): Promise<any> => onChoiceClick(e, "REJECTED")}
            className="mx-1 w-32 bg-red-500 py-2 font-bold text-white hover:bg-red-700 disabled:bg-slate-300"
          >
            Reject
          </button>
          <button
            disabled={lead.status === "APPROVED"}
            onClick={async (e): Promise<any> => onChoiceClick(e, "APPROVED")}
            className="mx-1 w-32 bg-green-500 py-2 font-bold text-white hover:bg-green-700 disabled:bg-slate-300"
          >
            Approve
          </button>
        </div>

        <div className="mt-2 flex justify-end md:mt-0">
          <>
            <span
              className="text-black-600 h-10 w-10 visited:text-purple-600 hover:text-blue-800"
              onClick={(): void => {
                if (count > 0) {
                  setCount(count - 1);
                }
              }}
            >
              Previous ←
            </span>
          </>
          <span
            className="text-black-600 mx-10 h-10 w-10 visited:text-purple-600 hover:text-blue-800"
            onClick={(): void => {
              if (count + 1 !== leads?.length) setCount(count + 1);
            }}
          >
            Next →
          </span>
        </div>
      </>
    );
  }
};

export default HomePage;
