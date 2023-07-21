import axios from "axios";
import buildClient from "../api/build-client";
import getConfig from "next/config";

const LandingPage = ({currentUser}) => {
  
  
  return currentUser ?
    <>
      <h1>You are signed in</h1>
    </>
    : <h1>You are not signed in</h1>
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