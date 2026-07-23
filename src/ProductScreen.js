import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { mockApi } from './api';

export default function ProductScreen({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Please enter product name and price');
      return;
    }

    try {
      if (editingId) {
        const updatedProduct = await mockApi.updateProduct(editingId, { name, price, image });
        setProducts(products.map(p => p.id === editingId ? updatedProduct : p));
        setEditingId(null);
      } else {
        const newProduct = await mockApi.addProduct({ name, price, image });
        setProducts([...products, newProduct]);
      }
      setName('');
      setPrice('');
      setImage(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setImage(product.image || null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setImage(null);
  };

  const handleDelete = async (id) => {
    try {
      await mockApi.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      {item.image && <Image source={{ uri: item.image }} style={styles.productListImage} />}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
        <Button title="Logout" onPress={onLogout} color="#d9534f" />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{editingId ? 'Edit Product' : 'Add New Product'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <View style={styles.imagePickerContainer}>
          <Button title="Pick an image" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        </View>
        <View style={styles.formActions}>
          <Button title={editingId ? 'Update' : 'Add'} onPress={handleSave} />
          {editingId && (
            <View style={styles.cancelButtonContainer}>
              <Button title="Cancel" onPress={handleCancelEdit} color="#6c757d" />
            </View>
          )}
        </View>
      </View>

      <Text style={styles.listTitle}>Product List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 40, // for status bar
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  imagePickerContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cancelButtonContainer: {
    marginLeft: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  listContent: {
    padding: 15,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productListImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 5,
  },
  productActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});
