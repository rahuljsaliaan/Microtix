import axios from 'axios';
import { useState } from 'react';

export function useRequest({ url, method, body, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  async function doRequest() {
    try {
      setIsLoading(true);
      setErrors(null);

      const response = await axios[method](url, body);

      if (onSuccess) onSuccess(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops..</h4>
          <ul className="my-0">
            {(
              error?.response?.data?.errors || [{ message: error.message }]
            ).map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { doRequest, isLoading, errors };
}
