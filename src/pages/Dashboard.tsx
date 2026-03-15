import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message, Popconfirm, Image, Tabs, Checkbox } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined, LockOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

interface Category {
  ID: number;
  name: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  isHidden: boolean;
}

interface Product {
  ID: number;
  name: string;
  description: string;
  prices: { [key: string]: number };
  imageUrls: string[] | null;
  isHidden: boolean;
  categoryId: number;
}

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});

  // Content Forms
  const [heroForm] = Form.useForm();
  const [featuresForm] = Form.useForm();
  const [aboutForm] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [statsForm] = Form.useForm();

  // Category Modal State
  const [isCatModalVisible, setIsCatModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catForm] = Form.useForm();

  // Product Modal State
  const [isProdModalVisible, setIsProdModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.SITE_CONTENT}`);
      const resData = await response.json();
      const contentMap: Record<string, any> = {};
      (resData.data || []).forEach((item: any) => {
        try {
          contentMap[item.section] = JSON.parse(item.data);
        } catch (e) {
          console.error(e);
        }
      });
      setSiteContent(contentMap);
      
      // Initialize forms
      if (contentMap.hero) heroForm.setFieldsValue(contentMap.hero);
      if (contentMap.features) featuresForm.setFieldsValue(contentMap.features);
      if (contentMap.about) aboutForm.setFieldsValue(contentMap.about);
      if (contentMap.contact) contactForm.setFieldsValue(contentMap.contact);
      if (contentMap.stats) statsForm.setFieldsValue(contentMap.stats);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải nội dung website');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CATEGORIES}`);
      const resData = await response.json();
      setCategories(resData.data || []);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải danh mục');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS}`);
      const resData = await response.json();
      setProducts(resData.data || []);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải sản phẩm');
    }
  };

  // --- CATEGORY CRUD ---
  const handleAddCategory = () => {
    setEditingCategory(null);
    catForm.resetFields();
    catForm.setFieldsValue({ isHidden: false });
    setIsCatModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    catForm.setFieldsValue(category);
    setIsCatModalVisible(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await fetch(`${API_ENDPOINTS.CATEGORIES}/${id}`, { method: 'DELETE' });
      message.success('Đã xóa danh mục');
      fetchCategories();
    } catch (error) {
      message.error('Lỗi khi xóa');
    }
  };

  const onCatFinish = async (values: any) => {
    setLoading(true);
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory ? `${API_ENDPOINTS.CATEGORIES}/${editingCategory.ID}` : `${API_ENDPOINTS.CATEGORIES}`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) throw new Error('Failed');
      message.success(editingCategory ? 'Cập nhật danh mục thành công' : 'Thêm danh mục thành công');
      setIsCatModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCT CRUD ---
  const handleAddProduct = () => {
    setEditingProduct(null);
    prodForm.resetFields();
    prodForm.setFieldsValue({ isHidden: false });
    setFileList([]);
    setIsProdModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    prodForm.setFieldsValue({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      isHidden: product.isHidden,
      priceList: Object.entries(product.prices || {}).map(([tier, price]) => ({ tier, price }))
    });
    
    const existingFiles = (product.imageUrls || []).map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}.png`,
      status: 'done',
      url: url,
    }));
    setFileList(existingFiles);
    setIsProdModalVisible(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, { method: 'DELETE' });
      message.success('Đã xóa sản phẩm');
      fetchProducts();
    } catch (error) {
      message.error('Lỗi khi xóa');
    }
  };

  const onProdFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('categoryId', values.categoryId.toString());
      formData.append('isHidden', values.isHidden ? 'true' : 'false');
      
      const pricesObject: { [key: string]: number } = {};
      (values.priceList || []).forEach((item: any) => {
        if (item.tier && item.price !== undefined) {
          pricesObject[item.tier] = item.price;
        }
      });
      formData.append('prices', JSON.stringify(pricesObject));

      const existingImages = fileList
        .filter(file => !file.originFileObj && file.url)
        .map(file => file.url);
      formData.append('existingImageUrls', JSON.stringify(existingImages));

      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `${API_ENDPOINTS.PRODUCTS}/${editingProduct.ID}` : `${API_ENDPOINTS.PRODUCTS}`;

      const response = await fetch(url, { method, body: formData });
      if (!response.ok) throw new Error('Failed');
      
      message.success(editingProduct ? 'Cập nhật thành công' : 'Thêm mới thành công');
      setIsProdModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const onSaveContent = async (section: string, values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.SITE_CONTENT}/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: JSON.stringify(values) })
      });
      
      if (!response.ok) throw new Error('Failed');
      message.success(`Cập nhật nội dung ${section} thành công`);
      fetchSiteContent();
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu nội dung');
    } finally {
      setLoading(false);
    }
  };

  // --- TABLE COLUMNS ---
  const catColumns = [
    { title: 'Tên Nội Bộ', dataIndex: 'name', key: 'name' },
    { title: 'Badge', dataIndex: 'badge', key: 'badge' },
    { title: 'Tiêu Đề', dataIndex: 'title', key: 'title' },
    { title: 'Trạng Thái', dataIndex: 'isHidden', key: 'isHidden', render: (h: boolean) => h ? 'Đang Ẩn' : 'Hiển Thị' },
    {
      title: 'Hành động', key: 'actions',
      render: (_: any, record: Category) => (
        <span style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditCategory(record)} size="small" />
          <Popconfirm title="Xóa danh mục này?" onConfirm={() => handleDeleteCategory(record.ID)} okText="Có" cancelText="Không">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </span>
      )
    }
  ];

  const prodColumns = [
    {
      title: 'Hình ảnh', dataIndex: 'imageUrls', key: 'imageUrls',
      render: (urls: string[] | null) => (urls && urls.length > 0) ? <Image width={60} height={60} src={urls[0]} alt="product" style={{ objectFit: 'cover', borderRadius: 8 }} /> : 'Không có'
    },
    { title: 'Tên Sản Phẩm', dataIndex: 'name', key: 'name' },
    { 
      title: 'Danh Mục', dataIndex: 'categoryId', key: 'categoryId',
      render: (id: number) => categories.find(c => c.ID === id)?.name || 'Không rõ'
    },
    {
      title: 'Các Loại Giá', dataIndex: 'prices', key: 'prices',
      render: (p: any) => (
        <div style={{ fontSize: '12px' }}>
          {p ? Object.entries(p).map(([tier, price]) => (
            <div key={tier}>
              <strong style={{ color: '#e11d48' }}>{tier}:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price as number)}
            </div>
          )) : 'Chưa có giá'}
        </div>
      )
    },
    { title: 'Trạng Thái', dataIndex: 'isHidden', key: 'isHidden', render: (h: boolean) => h ? 'Đang Ẩn' : 'Hiển Thị' },
    {
      title: 'Hành động', key: 'actions',
      render: (_: any, record: Product) => (
        <span style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditProduct(record)} size="small" />
          <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => handleDeleteProduct(record.ID)} okText="Có" cancelText="Không">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </span>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={3} style={{ margin: 0 }}>Dashboard Quản Trị Hệ Thống</Title>
        <Button 
          type="text" 
          danger 
          icon={<LockOutlined />} 
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
          }}
        >
          Đăng xuất
        </Button>
      </Header>
      <Content style={{ margin: '24px', padding: 24, background: '#fff' }}>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          
          {/* CATEGORIES TAB */}
          <TabPane tab="Quản Lý Danh Mục" key="categories">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
                Thêm Danh Mục Mới
              </Button>
            </div>
            <Table columns={catColumns} dataSource={categories} rowKey="ID" loading={loading} pagination={{ pageSize: 10 }} />
          </TabPane>

          {/* PRODUCTS TAB */}
          <TabPane tab="Quản Lý Sản Phẩm" key="products">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
                Thêm Sản Phẩm Mới
              </Button>
            </div>
            <Table columns={prodColumns} dataSource={products} rowKey="ID" loading={loading} pagination={{ pageSize: 10 }} />
          </TabPane>

          {/* HERO CONTENT TAB */}
          <TabPane tab="Nội Dung Hero" key="hero">
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Form form={heroForm} layout="vertical" onFinish={(v) => onSaveContent('hero', v)}>
                <Form.Item name="badge" label="Badge (Dòng chữ nhỏ trên tiêu đề)">
                  <Input />
                </Form.Item>
                <Form.Item name="title" label="Tiêu đề chính (Dùng \n để xuống dòng)">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="subtitle" label="Mô tả ngắn">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Danh sách Tag Hot (Dưới mô tả)">
                  <Form.List name="tags">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <div key={field.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <Form.Item {...field} noStyle>
                              <Input placeholder="Tên tag (ví dụ: Gấu Bông 🧸)" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: '#ff4d4f', paddingTop: 8 }} />
                          </div>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm Tag
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
                <Form.Item label="Danh sách Nút Bấm (CTA)">
                  <Form.List name="actions">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <div key={field.key} style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <Form.Item {...field} name={[field.name, 'label']} label="Tên nút" style={{ flex: 1 }}>
                                <Input placeholder="VD: 🧳 Xem Vali" />
                              </Form.Item>
                              <Form.Item {...field} name={[field.name, 'href']} label="Link" style={{ flex: 1 }}>
                                <Input placeholder="VD: #products" />
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: '#ff4d4f', paddingTop: 30 }} />
                            </div>
                            <Form.Item {...field} name={[field.name, 'type']} label="Loại nút" style={{ marginBottom: 0 }}>
                              <Select>
                                <Option value="primary">Màu Trắng (Nổi bật)</Option>
                                <Option value="outline">Viền trắng (Trong suốt)</Option>
                                <Option value="glass">Mờ (Kính mờ)</Option>
                              </Select>
                            </Form.Item>
                          </div>
                        ))}
                        <Button type="dashed" onClick={() => add({ type: 'primary' })} block icon={<PlusOutlined />}>
                          Thêm Nút Bấm
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ marginTop: 16 }}>
                  Lưu Nội Dung Hero
                </Button>
              </Form>
            </div>
          </TabPane>

          {/* FEATURES TAB */}
          <TabPane tab="Điểm Nổi Bật" key="features">
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Form form={featuresForm} layout="vertical" onFinish={(v) => onSaveContent('features', v)}>
                <Form.Item name="badge" label="Badge Section">
                  <Input />
                </Form.Item>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="title" label="Tiêu đề section" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="titleHighlight" label="Phần tiêu đề nổi bật" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </div>
                <Form.Item name="subtitle" label="Mô tả section">
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item label="Danh sách các tính năng (Tối đa 6)">
                  <Form.List name="items">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <div key={field.key} style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 16, position: 'relative' }}>
                            <MinusCircleOutlined onClick={() => remove(field.name)} style={{ position: 'absolute', right: 8, top: 8, color: '#ff4d4f' }} />
                            <div style={{ display: 'flex', gap: 16 }}>
                              <Form.Item {...field} name={[field.name, 'icon']} label="Icon" style={{ width: 80 }}>
                                <Input maxLength={2} />
                              </Form.Item>
                              <Form.Item {...field} name={[field.name, 'title']} label="Tên tính năng" style={{ flex: 1 }}>
                                <Input />
                              </Form.Item>
                            </div>
                            <Form.Item {...field} name={[field.name, 'desc']} label="Mô tả chi tiết" style={{ marginBottom: 0 }}>
                              <Input.TextArea rows={2} />
                            </Form.Item>
                          </div>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm Tính Năng mới
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Lưu Điểm Nổi Bật
                </Button>
              </Form>
            </div>
          </TabPane>

          {/* ABOUT TAB */}
          <TabPane tab="Về Chúng Tôi" key="about">
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Form form={aboutForm} layout="vertical" onFinish={(v) => onSaveContent('about', v)}>
                <Form.Item name="badge" label="Badge Section">
                  <Input />
                </Form.Item>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="title" label="Tiêu đề section" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="titleHighlight" label="Phần tiêu đề nổi bật" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </div>
                <Form.Item name="description" label="Mô tả chính">
                  <Input.TextArea rows={4} />
                </Form.Item>
                
                <div style={{ display: 'flex', gap: 32 }}>
                  <div style={{ flex: 1 }}>
                    <Form.Item label="Danh sách Highlight (Dấu chấm đầu dòng)">
                      <Form.List name="highlights">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field) => (
                              <div key={field.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <Form.Item {...field} name={[field.name, 'text']} noStyle>
                                  <Input.TextArea rows={2} placeholder="Nội dung highlight..." />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: '#ff4d4f', paddingTop: 8 }} />
                              </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Thêm Highlight
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Item label="Các con số thống kê (Bên phải)">
                      <Form.List name="stats">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field) => (
                              <div key={field.key} style={{ display: 'flex', gap: 8, marginBottom: 8, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                                <div style={{ flex: 1 }}>
                                  <Form.Item {...field} name={[field.name, 'value']} label="Giá trị (Ví dụ: 20+)" style={{ marginBottom: 4 }}>
                                    <Input />
                                  </Form.Item>
                                  <Form.Item {...field} name={[field.name, 'label']} label="Mô tả (Ví dụ: Năm KN)" style={{ marginBottom: 0 }}>
                                    <Input />
                                  </Form.Item>
                                </div>
                                <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: '#ff4d4f', paddingTop: 30 }} />
                              </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Thêm Thông Số
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                  </div>
                </div>

                <Button type="primary" htmlType="submit" loading={loading} block style={{ marginTop: 24 }}>
                  Lưu Nội Dung Giới Thiệu
                </Button>
              </Form>
            </div>
          </TabPane>

          {/* CONTACT TAB */}
          <TabPane tab="Liên Hệ" key="contact">
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Form form={contactForm} layout="vertical" onFinish={(v) => onSaveContent('contact', v)}>
                <Form.Item name="badge" label="Badge Section">
                  <Input />
                </Form.Item>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="title" label="Tiêu đề section" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </div>

                <Title level={5}>Cấu hình Logo \u0026 Menu</Title>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="highlight" label="Tên Logo (Dòng trên)" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="logoSub" label="Tên Logo (Dòng dưới)" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </div>

                <Form.Item name="subtitle" label="Mô tả section">
                  <Input.TextArea rows={2} />
                </Form.Item>
                
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="phone" label="Số điện thoại hiển thị" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="phoneHref" label="Link điện thoại (tel:...)" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="address" label="Địa chỉ cửa hàng" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="mapHref" label="Link Google Maps (Nút mở map)" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="hours" label="Giờ mở cửa" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="facebookUrl" label="Link Facebook cá nhân/page" style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </div>

                <Form.Item name="mapEmbedSrc" label="Link nhúng Bản đồ (iframe src)">
                  <Input.TextArea rows={4} placeholder="Copy link từ nút Chia sẻ -> Nhúng bản đồ trên Google Maps" />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading} block>
                  Lưu Thông Tin Liên Hệ
                </Button>
              </Form>
            </div>
          </TabPane>

          {/* STATS BAND TAB */}
          <TabPane tab="Băng Thống Kê" key="stats">
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Title level={4}>Dải con số thống kê dưới Hero</Title>
              <Form form={statsForm} layout="vertical" onFinish={(v) => onSaveContent('stats', v)}>
                <Form.List name="items">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <div key={field.key} style={{ display: 'flex', gap: 16, padding: 16, background: '#fafafa', borderRadius: 8, marginBottom: 16, alignItems: 'end' }}>
                          <Form.Item {...field} name={[field.name, 'value']} label="Con số (VD: 2000)" style={{ flex: 1, marginBottom: 0 }}>
                            <Input />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'suffix']} label="Hậu tố (VD: +)" style={{ width: 100, marginBottom: 0 }}>
                            <Input />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'label']} label="Mô tả (VD: Điểm bán)" style={{ flex: 2, marginBottom: 0 }}>
                            <Input />
                          </Form.Item>
                          <Button danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                        </div>
                      ))}
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
                        Thêm con số mới
                      </Button>
                    </>
                  )}
                </Form.List>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Lưu Băng Thống Kê
                </Button>
              </Form>
            </div>
          </TabPane>

        </Tabs>

        {/* CATEGORY MODAL */}
        <Modal
          title={editingCategory ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
          open={isCatModalVisible}
          onOk={() => catForm.submit()}
          onCancel={() => setIsCatModalVisible(false)}
          confirmLoading={loading}
        >
          <Form form={catForm} layout="vertical" onFinish={onCatFinish}>
            <Form.Item name="name" label="Tên Nội Bộ (Ví dụ: Gấu Bông)" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="badge" label="Badge (Ví dụ: 🧸 Bán Chạy)">
              <Input />
            </Form.Item>
            <Form.Item name="title" label="Tiêu đề chính (Ví dụ: Gấu Bông –)">
              <Input />
            </Form.Item>
            <Form.Item name="titleHighlight" label="Tiêu đề nối màu nổi (Ví dụ: Siêu Cute)">
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả danh mục">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="isHidden" valuePropName="checked">
              <Checkbox>Ẩn danh mục này khỏi trang chủ</Checkbox>
            </Form.Item>
          </Form>
        </Modal>

        {/* PRODUCT MODAL */}
        <Modal
          title={editingProduct ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          open={isProdModalVisible}
          onOk={() => prodForm.submit()}
          onCancel={() => setIsProdModalVisible(false)}
          confirmLoading={loading}
        >
          <Form form={prodForm} layout="vertical" onFinish={onProdFinish}>
            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
              <Input placeholder="Ví dụ: Cặp sách siêu nhân" />
            </Form.Item>
            <Form.Item name="categoryId" label="Thuộc Danh Mục" rules={[{ required: true }]}>
              <Select placeholder="Chọn danh mục">
                {categories.map(cat => (
                  <Option key={cat.ID} value={cat.ID}>{cat.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Mô tả sản phẩm">
              <Input.TextArea rows={3} />
            </Form.Item>
            
            <Form.Item label="Quản lý các loại giá (VD: Đầu trăm, Đầu chục, CTV...)">
              <Form.List name="priceList">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ display: 'flex', gap: '8px', marginBottom: 8, alignItems: 'center' }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'tier']}
                          style={{ flex: 1, marginBottom: 0 }}
                          rules={[{ required: true, message: 'Nhập loại giá (VD: Đầu trăm)' }]}
                        >
                          <Input placeholder="Loại giá (Đầu trăm, Đầu chục...)" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'price']}
                          style={{ flex: 1, marginBottom: 0 }}
                          rules={[{ required: true, message: 'Nhập số tiền' }]}
                        >
                          <InputNumber
                            placeholder="Số tiền"
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm loại giá mới
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>

            <Form.Item label="Hình ảnh (Được phép chọn nhiều)">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                beforeUpload={() => false}
                multiple={true}
                maxCount={10}
              >
                {fileList.length < 10 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item name="isHidden" valuePropName="checked">
              <Checkbox>Ẩn sản phẩm này khỏi cửa hàng</Checkbox>
            </Form.Item>
          </Form>
        </Modal>

      </Content>
    </Layout>
  );
};

export default Dashboard;
