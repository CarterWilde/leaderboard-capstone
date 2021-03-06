import axios from "axios";

export const IDBTranslator = async <T>(id: string, endpoint: string): Promise<T> => {
	return (await axios.get<T>(endpoint.replace("@:", id))).data
};

export default IDBTranslator