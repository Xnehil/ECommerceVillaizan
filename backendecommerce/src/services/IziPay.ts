import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"

class IziPayService extends TransactionBaseService {
    private merchantCode: string = process.env.IZIPAY_MERCHANT_CODE;
    private publicKey: string = process.env.IZIPAY_PUBLIC_KEY;

    constructor(container){
        super(container);
    }

    async generarToken(orderNumber: string, amount: string, transactionId: string): Promise<string> {
        const url = 'https://sandbox-api-pw.izipay.pe/gateway/api/v1/proxy-cors/https://sandbox-api-pw.izipay.pe/security/v1/Token/Generate';
        const data = {
            requestSource: "ECOMMERCE",
            merchantCode:  this.merchantCode,
            orderNumber:  orderNumber,
            publicKey:  this.publicKey,
            amount: amount,
        };
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'transactionId':  transactionId,
        };
        console.log('Request to IziPay API with data:', data ," and headers:", headers);
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
          });
        const responseBody = await response.text();
        console.log('Response from IziPay API:', responseBody);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const responseData = JSON.parse(responseBody);
        return responseData.token; // Adjust based on the actual response structure
        } catch (error) {
        console.error('Error generating session token:', error);
        throw error;
        }
    }

}

export default IziPayService;