import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers, deleteUser, promoteToAdmin, demoteToUser } from '../../api/users';
import { User } from '../../types/user';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { Badge } from '../../components/ui/badge';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const { token, user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (token) {
        const data = await getAllUsers(token);
        setUsers(data);
      }
    } catch (err) {
      setError('Impossible de récupérer la liste des utilisateurs');
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDeleteUser = async () => {
    if (!token || !userToDelete) return;

    try {
      await deleteUser(token, userToDelete);
      setUsers(users.filter(user => user.id !== userToDelete));
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Impossible de supprimer cet utilisateur');
    }
  };

  const handlePromoteUser = async (userId: number) => {
    if (!token) return;

    try {
      await promoteToAdmin(token, userId);
      fetchUsers(); // Reload the users list
    } catch (err) {
      console.error('Failed to promote user:', err);
      setError('Impossible de promouvoir cet utilisateur');
    }
  };

  const handleDemoteUser = async (userId: number) => {
    if (!token) return;

    try {
      await demoteToUser(token, userId);
      fetchUsers(); // Reload the users list
    } catch (err) {
      console.error('Failed to demote user:', err);
      setError('Impossible de rétrograder cet utilisateur');
    }
  };

  if (loading) {
    return <div className="p-4">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Nom</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rôle</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {user.role === 'admin' 
                        ? <Badge variant="default">Admin</Badge> 
                        : <Badge variant="outline">Utilisateur</Badge>}
                    </td>
                    <td className="px-4 py-2">
                      {user.is_active 
                        ? <Badge variant="default" className="bg-green-500">Actif</Badge> 
                        : <Badge variant="outline">Inactif</Badge>}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {user.id !== currentUser?.id && (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => setUserToDelete(user.id)}
                              >
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer l'utilisateur {user.name} ?
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteUser}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {user.role === 'admin' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDemoteUser(user.id)}
                            >
                              Rétrograder
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePromoteUser(user.id)}
                            >
                              Promouvoir
                            </Button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersList;
