import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Phone, X, Clock, User, AlertTriangle } from "lucide-react";

interface EmergencyCall {
	intensity: number;
	startTime: string;
	id: string;
	severity: "P0" | "P1" | "P2" | "P3";
	type: string;
	description: string;
	timestamp: number; // Timestamp de création de l'appel
}

// Fonction pour formater la durée
const formatDuration = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const useTimer = (timestamp: number) => {
	const [duration, setDuration] = useState<number>(0);

	useEffect(() => {
		const calculateDuration = () => {
			const now = Date.now();
			const diffInSeconds = Math.floor((now - timestamp) / 1000);
			setDuration(diffInSeconds);
		};

		calculateDuration(); // Calcul initial
		const intervalId = setInterval(calculateDuration, 1000);

		return () => clearInterval(intervalId);
	}, [timestamp]);

	return formatDuration(duration);
};

const IntensityGauge: React.FC<{ intensity: number }> = ({ intensity }) => {
	const getColor = (level: number) => {
		if (level >= 80) return "bg-red-500";
		if (level >= 60) return "bg-orange-500";
		if (level >= 40) return "bg-yellow-500";
		return "bg-green-500";
	};

	return (
		<div className="w-1.5 h-12 rounded-full bg-gray-200 relative">
			<div
				className={`absolute bottom-0 w-full rounded-full ${getColor(
					intensity
				)}`}
				style={{ height: `${intensity}%` }}
			/>
		</div>
	);
};

const SeverityBadge: React.FC<{ severity: "P0" | "P1" | "P2" | "P3" }> = ({
	severity,
}) => {
	const getVariant = (
		severity: "P0" | "P1" | "P2" | "P3"
	): "destructive" | "default" | "secondary" | "outline" => {
		const variants: {
			[key in "P0" | "P1" | "P2" | "P3"]:
				| "destructive"
				| "default"
				| "secondary"
				| "outline";
		} = {
			P0: "destructive",
			P1: "default",
			P2: "secondary",
			P3: "outline",
		};
		return variants[severity];
	};

	return <Badge variant={getVariant(severity)}>{severity}</Badge>;
};

const CallDetails: React.FC<{
	call: EmergencyCall;
	onClose: () => void;
	onAnswer: () => void;
}> = ({ call, onClose, onAnswer }) => {
	const duration = useTimer(call.timestamp);

	return (
		<div className="space-y-6">
			<DialogHeader>
				<div className="flex items-center justify-between">
					<DialogTitle className="text-xl">Appel {call.id}</DialogTitle>
					<div className="flex items-center space-x-2">
						<Button variant="outline" size="icon" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button size="icon">
									<Phone className="h-4 w-4" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Prendre l'appel</AlertDialogTitle>
									<AlertDialogDescription>
										Êtes-vous sûr de vouloir prendre cet appel ? Cette action ne
										peut pas être annulée.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Annuler</AlertDialogCancel>
									<AlertDialogAction onClick={onAnswer}>
										Prendre l'appel
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</DialogHeader>

			<Card>
				<CardHeader>
					<CardTitle className="text-base font-medium flex items-center space-x-2">
						<AlertTriangle className="h-4 w-4" />
						<span>Informations d'urgence</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-2">
							<Clock className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-500">Durée de l'appel</span>
						</div>
						<span className="font-medium">{duration}</span>
					</div>
					<Separator />
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-2">
							<User className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-500">Type d'urgence</span>
						</div>
						<div className="flex items-center space-x-2">
							<span className="font-medium">{call.type}</span>
							<SeverityBadge severity={call.severity} />
						</div>
					</div>
					<Separator />
					<div>
						<span className="text-sm text-gray-500">Description complète</span>
						<p className="mt-2">{call.description}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

const CallPill: React.FC<{
	call: EmergencyCall;
	onAnswer: (id: string) => void;
}> = ({ call, onAnswer }) => {
	const [isOpen, setIsOpen] = useState(false);
	const duration = useTimer(call.timestamp);

	const getSeverityColor = (severity: "P0" | "P1" | "P2" | "P3") => {
		const colors = {
			P0: "bg-red-100 hover:bg-red-200",
			P1: "bg-orange-100 hover:bg-orange-200",
			P2: "bg-yellow-100 hover:bg-yellow-200",
			P3: "bg-green-100 hover:bg-green-200",
		};
		return colors[severity] || "bg-gray-100 hover:bg-gray-200";
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<div
				onClick={() => setIsOpen(true)}
				className={`flex items-center h-20 rounded-lg mb-4 shadow-md ${getSeverityColor(
					call.severity
				)} 
          overflow-hidden whitespace-nowrap cursor-pointer transition-colors duration-200`}
			>
				<div className="flex items-center h-full px-6">
					<div className="py-4">
						<IntensityGauge intensity={call.intensity} />
					</div>
				</div>

				<div className="flex items-center flex-1 pr-4 space-x-8">
					<div className="w-16 text-gray-600 font-mono">{duration}</div>
					<div className="w-24 text-gray-800">{call.startTime}</div>
					<div className="w-24 text-gray-600">{call.id}</div>
					<div className="w-16">
						<SeverityBadge severity={call.severity} />
					</div>
					<div className="w-32 font-medium truncate">{call.type}</div>
					<div className="flex-1 text-gray-800 truncate">
						{call.description}
					</div>
				</div>
			</div>

			<DialogContent className="sm:max-w-[500px]">
				<CallDetails
					call={call}
					onClose={() => setIsOpen(false)}
					onAnswer={() => {
						onAnswer(call.id);
						setIsOpen(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
};

const EmergencyCallsList: React.FC = () => {
	const handleAnswerCall = (id: string) => {
		console.log(`Appel ${id} décroché`);
	};

	const calls: EmergencyCall[] = [
		{
			intensity: 90,
			startTime: "19:38:23",
			id: "1382331",
			severity: "P0",
			type: "Accident Motorisé",
			description:
				"Patient grièvement blessé suite à un accident de moto, il est inconscient mais respire encore.",
			timestamp: Date.now() - 143000,
		},
		{
			intensity: 75,
			startTime: "19:37:13",
			id: "1382327",
			severity: "P1",
			type: "Douleur",
			description:
				"Patient quinquagénaire qui souffre d'une grosse douleur dans le torax.",
			timestamp: Date.now() - 237000,
		},
	];

	return (
		<div className="p-6 max-w-6xl mx-auto">
			{calls.map((call) => (
				<CallPill key={call.id} call={call} onAnswer={handleAnswerCall} />
			))}
		</div>
	);
};

export default EmergencyCallsList;
