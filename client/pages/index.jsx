import { useEffect } from "react";
import useRequest from "../hooks/use-request";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { useState } from "react";
import Link from "next/link";

const LandingPage = ({ currentUser }) => {
  const [ticketList, setTicketList] = useState([]);
  const { doRequest, errors } = useRequest({
    url: `${publicRuntimeConfig.TICKETS_URL}/api/show-all-tickets`,
    method: 'get',
    onSuccess: (ticket) => {
      console.log(ticket);
      setTicketList(ticket);
    }
  })

  useEffect(() => {
    doRequest()
  }, [])
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {
            ticketList?.map((ticket) => {
              return (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.price}</td>
                  <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              )})
        }
        </tbody>
      </table>
    </div>
  );
}

export default LandingPage;