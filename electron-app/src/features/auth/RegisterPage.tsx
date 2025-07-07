// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { register } from '../../api/auth';
// import { Button } from '../../components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

// const RegisterPage: React.FC = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isAlertOpen, setIsAlertOpen] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setIsLoading(true);
    
//     try {
//       await register(name, email, password);
//       setSuccessMessage('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (err: any) {
//       setError(err.response?.data?.detail || 'Une erreur est survenue lors de l\'inscription');
//       setIsAlertOpen(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const goToLogin = () => {
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {successMessage ? (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//               {successMessage}
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Nom
//                 </label>
//                 <input
//                   id="name"
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Mot de passe
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   minLength={8}
//                 />
//                 <p className="text-xs text-gray-500">
//                   Le mot de passe doit contenir au moins 8 caractères dont une majuscule, 
//                   un chiffre et un caractère spécial.
//                 </p>
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? 'Création en cours...' : 'Créer un compte'}
//               </Button>
//             </form>
//           )}
          
//           <div className="mt-4 text-center">
//             <p className="text-sm text-gray-600">
//               Vous avez déjà un compte ?{' '}
//               <button 
//                 type="button"
//                 onClick={goToLogin}
//                 className="text-blue-600 hover:underline"
//               >
//                 Se connecter
//               </button>
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Erreur d'inscription</AlertDialogTitle>
//             <AlertDialogDescription>{error}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex justify-end">
//             <Button onClick={() => setIsAlertOpen(false)}>OK</Button>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default RegisterPage;
