import { Button, Col, Form, Input, Modal, Row, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleFilled,
  FileAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  addServices,
  deleteServices,
  getServices,
  updateServices,
} from "../../api/api";

const ClinicService = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingService, setEditingService] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [clinicService, setClinicService] = useState([]);
  const [searchedText, setSearchedText] = useState("");

  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const { data } = useQuery({ queryFn: getServices, queryKey: ["services"] });

  const services = data?.data?.clinicServices;

  const { TextArea } = Input;

  console.log("Clinic Data ?", clinicService);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteServices,
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      toast.success("Deleted successfully");
      setEditModal(false);
    },
  });

  const deleteClinicService = (id) => {
    Modal.confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteMutation.mutate({ id });
      },
    });
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addServices,
    mutationKey: ["add-service"],
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);

      hideModal();
    },
  });

  const onFinish = async (values) => {
    console.log(values);
    mutation.mutate({ clinicService: values });
    form.resetFields();
  };

  const updateMutation = useMutation({
    mutationFn: updateServices,
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
      setEditModal(false);
    },
  });

  const onFinishEdit = async (values) => {
    updateMutation.mutate({
      clinicService: { clinicService: values },
      id: editingService._id,
    });
  };

  const editClinicService = (record) => {
    setEditingService(record);
    setEditModal(true);
  };

  const hideEditModal = () => {
    setEditModal(false);
  };

  const columns = [
    {
      title: "Service Name",
      dataIndex: "name",
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.name)?.toLowerCase()?.includes(value.toLowerCase()) ||
          String(record.name)?.toLowerCase()?.includes(value.toLowerCase()) ||
          String(record.name)?.toLowerCase()?.includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Service Description",
      dataIndex: "description",
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (text, record) => (
        <React.Fragment>
          <Space wrap>
            <Button
              onClick={() => {
                editClinicService(record);
              }}
              type="primary"
            >
              <EditFilled />
            </Button>
            <Button
              onClick={() => deleteClinicService(record._id)}
              type="primary"
              danger
            >
              <DeleteFilled />
            </Button>
          </Space>
        </React.Fragment>
      ),
    },
  ];
  return (
    <Layout>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Services</h1>
        <Button
          type="primary"
          onClick={showModal}
          style={{ marginLeft: "auto" }}
        >
          <PlusOutlined />
        </Button>
      </div>
      <Modal open={open} onCancel={hideModal} footer={null}>
        <Form onFinish={onFinish} form={form}>
          <Row>
            <Col>
              <Form.Item
                required
                label="Service Name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Service Name" />
              </Form.Item>
              <Form.Item
                required
                label="Service Description"
                name="description"
                rules={[{ required: true }]}
              >
                <TextArea placeholder="Service Description" rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Button className="primary-button" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Edit Clinic Service"
        open={editModal}
        onCancel={hideEditModal}
        footer={null}
      >
        <Form onFinish={onFinishEdit} initialValues={{ ...editingService }}>
          <Row>
            <Col>
              <Form.Item
                required
                label="Service Name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Service Name" />
              </Form.Item>
              <Form.Item
                required
                label="Description Name"
                name="description"
                rules={[{ required: true }]}
              >
                <TextArea placeholder="Description" />
              </Form.Item>
            </Col>
          </Row>
          <Button className="primary-button" htmlType="submit">
            Update
          </Button>
        </Form>
      </Modal>
      <Input.Search
        placeholder="Search here..."
        style={{ marginBottom: 8 }}
        onSearch={(value) => {
          setSearchedText(value);
        }}
        onChange={(e) => {
          setSearchedText(e.target.value);
        }}
        inputStyle={{ borderRadius: "20px" }}
      />

      <Table
        columns={columns}
        dataSource={services}
        pagination={{
          pageSize: 7,
          total: services?.length,
        }}
      />
      <Toaster />
    </Layout>
  );
};

export default ClinicService;
