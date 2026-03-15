import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    setLoading(true);
    // Fake login logic per user request (Password based)
    if (values.password === 'admin123') { // Temporary password, can be changed
      localStorage.setItem('isAuthenticated', 'true');
      message.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } else {
      message.error('Mật khẩu không chính xác!');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #FF9EBE 0%, #E8658A 100%)' 
    }}>
      <Card 
        style={{ 
          width: 400, 
          borderRadius: 24, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: 'none',
          padding: '20px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            background: 'rgba(232, 101, 138, 0.1)', 
            borderRadius: 16, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#E8658A',
            fontSize: 32
          }}>
            <LockOutlined />
          </div>
          <Title level={3} style={{ margin: 0, fontWeight: 900, color: '#3d1a26' }}>Quản Trị Hệ Thống</Title>
          <p style={{ color: '#9e7b87', marginTop: 8 }}>Vui lòng nhập mật khẩu truy cập</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#ccc' }} />} 
              placeholder="Mật khẩu" 
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={{ 
                height: 50, 
                borderRadius: 12, 
                background: '#E8658A', 
                border: 'none',
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 10px 20px rgba(232, 101, 138, 0.3)'
              }}
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
