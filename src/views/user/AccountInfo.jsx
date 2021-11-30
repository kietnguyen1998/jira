import React, { useCallback, useEffect } from "react";
import Layout from "../../hocs/layout/layout";
import { Avatar, Input } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../stores/action/user";

export default function AccountInfo() {
  const dispatch = useDispatch();
  const isMeoloveBe = JSON.parse(localStorage.getItem("isMeoLoveBe"));

  const fetUser = useCallback(() => {
    dispatch(fetchUser(isMeoloveBe.id));
}, [dispatch, isMeoloveBe.id]);

  useEffect(() => {
    fetUser();
  }, [fetUser]);
  const data = useSelector((state) => state.users.users);
  const cloneData = { ...data[0] };

  return (
    <Layout>
      <h2>Account Info</h2>
      {data && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-evenly",
          }}
        >
          <div>
            <Avatar size={150} src={cloneData.avatar} alt={cloneData.userId} />
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bolder",
              }}
            >
              Avatar
            </p>
          </div>
          <div style={{ width: "50%" }}>
            <div style={{ margin: "20px 0" }}>
              <p style={{ fontSize: "20px", fontWeight: "bolder" }}>Name :</p>
              <Input value={cloneData.name}></Input>
            </div>
            <div style={{ margin: "20px 0" }}>
              <p style={{ fontSize: "20px", fontWeight: "bolder" }}>
                User Id :
              </p>
              <Input type="password" value={cloneData.userId}></Input>
            </div>
            <div style={{ margin: "20px 0" }}>
              <p style={{ fontSize: "20px", fontWeight: "bolder" }}>E-mail :</p>
              <Input value={cloneData.email}></Input>
            </div>
            <div style={{ margin: "20px 0" }}>
              <p style={{ fontSize: "20px", fontWeight: "bolder" }}>
                Phone Number :{" "}
              </p>
              <Input value={cloneData.phoneNumber}></Input>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
