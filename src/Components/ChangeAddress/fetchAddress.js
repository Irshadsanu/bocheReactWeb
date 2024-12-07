
import { getFirestore, collection, doc, getDocs } from "firebase/firestore";
import AddressModel from "../../ModelClasses/AddressModel";

const fetchAddress = async (cosId) => {

  const db = getFirestore();
  const addressRef = collection(db, `CUSTOMERS/${cosId}/DELIVER_ADDRESS`);
  
  const querySnapshot = await getDocs(addressRef);
  const addressModelList = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();



    console.log(data.USER_ID,)

    const address = new AddressModel(
      doc.id,
      cosId,
      data.USER_NAME,
      data.USER_MOBILE,
      data.USER_LAND_MARK,
      data.USER_LOCALITY,
      data.USER_CITY,
      data.USER_PIN_CODE,
      data.USER_STATE,
      data.USER_HOUSE_NAME,
      data.USER_DISTRICT
    );
    addressModelList.push(address);
  });

  console.log(addressModelList,"fetaddresss in fetchh")

  return addressModelList;
};

export default fetchAddress;
