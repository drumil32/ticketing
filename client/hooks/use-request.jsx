import axios from "axios";
import { useState } from "react";

import React from 'react'

const useRequest = ({ url, method, body,token, onSuccess }) => {
    const [errors, setErrors] = useState(null);
    const doRequest = async (props={}) => {
        try {
            setErrors('');
            const response = await axios[method](url,{ ...body,...props}, {
                headers: {
                    authorization: "Bearer " + token,
                },
            });
            if (onSuccess) {
                onSuccess(response.data)
            }
            return response.data;
        } catch (error) {
            console.log('error occured')
            console.log(error)
            console.log(error.message)
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops....</h4>
                    <ul className="my-0">
                        {error.response.data.errors.map(err => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            )
        }
    }
    return { errors, doRequest };
}

export default useRequest