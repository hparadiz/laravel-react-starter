import { Linking } from 'react-native';
import { Platform } from "react-native";

class Http<T> {
    
    defaultPath: string;

    constructor()
    {
        this.defaultPath = 'v1/';
    }

    async getHostname()
    {
        // on web this returns something like http://localhost:8383/ or
        if (!['android','ios'].includes(Platform.OS)) {  
            return await Linking.getInitialURL();
        } else {
            return 'http://192.168.1.2:8383/';
        }
    }

    /**
     * Use this to generate a get variabled endpoint string
     * @param endpoint 
     * @param queryParams 
     * @returns a get variabled endpoint string
     */
    addQueryParamsToEndPoint(endpoint: string, queryParams: string | string[][] | Record<string, string> | {} | URLSearchParams | undefined): string
    {
        const queryString = new URLSearchParams(queryParams).toString();
        return endpoint + `?${queryString}`;
    }

    async post(
        endpoint: string,
        data?: string | string[][] | Record<string, string> | FormData
    ) {

        var url = await this.getHostname() + this.defaultPath + endpoint;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const body = isJson ? await response.json() : null;

    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return body;
        } catch (error: any) {
          throw new Error(`Failed to post data: ${error.message}`);
        }
    }
}

export default Http;