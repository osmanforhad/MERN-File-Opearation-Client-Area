import React, { useState, useEffect } from "react";
import download from "downloadjs";
import axios from "axios";
import { API_URL } from "../utils/constants";

const FilesList = () => {
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getFilesList();
  }, []);

  const getFilesList = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/getAllFiles`);
      setErrorMsg("");
      setFilesList(data);
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(`${API_URL}/download/${id}`, {
        responseType: "blob",
      });
      const split = path.split("/");
      const filename = split[split.length - 1];
      setErrorMsg("");
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg("Error while downloading file. Try again later");
      }
    }
  };

  const UserSearchHandler = async (event) => {
    event.preventDefault();
    try {
      let searchKey = event.target.value;
      if (searchKey.length === 0) {
        // return false;
        getFilesList();
      } else {
        const { data } = await axios.get(`${API_URL}/UserSearch/${searchKey}`);
        setErrorMsg("");
        if (data) {
          setFilesList(data);
        } else {
          getFilesList();
        }
      }
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  return (
    <div className="files-container">
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <input
        type="text"
        onChange={UserSearchHandler}
        className="search-box-style mb-2"
        placeholder="Search File Here..."
      />
      <table className="files-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Download File</th>
          </tr>
        </thead>
        <tbody>
          {filesList.length > 0 ? (
            filesList.map(
              ({ _id, title, description, file_path, file_mimetype }) => (
                <tr key={_id}>
                  <td className="file-title">{title}</td>
                  <td className="file-description">{description}</td>
                  <td>
                    <a
                      href="#/"
                      onClick={() =>
                        downloadFile(_id, file_path, file_mimetype)
                      }
                    >
                      Download
                    </a>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={3} style={{ fontWeight: "300" }}>
                No files found. Please add some.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilesList;
