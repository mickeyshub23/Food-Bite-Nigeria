import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        setLoading(false);
      }
    };

    const timeout = setTimeout(finish, 5000);

    const checkAuth = async () => {
      try {
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !authUser) {
          finish();
          clearTimeout(timeout);
          setUser(null);
          setProfile(null);
          return;
        }

        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();

        if (prof?.role === 'admin') {
          setUser(authUser);
          setProfile(prof);
        } else {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
        setProfile(null);
      } finally {
        clearTimeout(timeout);
        finish();
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      await checkAuth();
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);