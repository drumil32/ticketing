import axios from "axios";
import buildClient from "../api/build-client";
import { useCookies } from 'react-cookie';
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const LandingPage = ({ currentUser }) => {
  (currentUser)
  const [cookies] = useCookies(["token"]);
  const fun = async () => {
    try {
      const {token} = cookies;
      const response = await axios.get(`${publicRuntimeConfig.AUTH_URL}/api/users/current-user`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }
  fun();
  return <h1>this is landing page</h1>
}

// LandingPage.getInitialProps = async () => {
//   if( typeof window === 'undefined')  return {};
//   try {
//     // console
//     console.log(cookies);
//     const [cookies] = useCookies(["token"]);
//     const {token} = cookies;
//     const response = await buildClient(token).get('/api/users/current-user');
//     const { data } = response;
//     console.log(data)
//     return data;
//   } catch (error) {
//     console.log(error.message);
//   }
// }

export default LandingPage;