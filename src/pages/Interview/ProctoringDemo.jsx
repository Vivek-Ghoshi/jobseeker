// src/components/ProctoringDemo.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';

const ProctoringDemo = () => {
    const videoRef = useRef(null);
    const wsRef = useRef(null);
    const streamRef = useRef(null);
    const sendFrameIntervalRef = useRef(null);
    const canvasRef = useRef(document.createElement('canvas'));

    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatusText, setConnectionStatusText] = useState('Not Connected');
    const [connectionStatusClass, setConnectionStatusClass] = useState('bg-red-900 text-red-300'); // Tailwind classes
    const [logs, setLogs] = useState([]);
    const [alertMessages, setAlertMessages] = useState([]);

    // Proctoring Status States
    const [faceStatus, setFaceStatus] = useState('OK');
    const [neckStatus, setNeckStatus] = useState('OK');
    const [eyeStatus, setEyeStatus] = useState('OK');
    const [lipStatus, setLipStatus] = useState('OK');
    const [overallStatus, setOverallStatus] = useState('OK');
    const [detailsContent, setDetailsContent] = useState('');

    // Timers for no face detection
    const noFaceDetectedSinceRef = useRef(null);

    const addLog = useCallback((message, isError = false) => {
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        setLogs((prevLogs) => [
            ...prevLogs,
            { time: `[${timeString}]`, message, isError },
        ]);
    }, []);

    const updateProctoringStatus = useCallback(({ face, neck, eye, lip, overall, details }) => {
        setFaceStatus(face);
        setNeckStatus(neck);
        setEyeStatus(eye);
        setLipStatus(lip);
        setOverallStatus(overall);
        setDetailsContent(details || '');
    }, []);

    const resetProctoringStatus = useCallback(() => {
        updateProctoringStatus({
            face: 'OK',
            neck: 'OK',
            eye: 'OK',
            lip: 'OK',
            overall: 'OK',
            details: '',
        });
    }, [updateProctoringStatus]);

    const updateAlerts = useCallback(() => {
        let face = 'OK', neck = 'OK', eye = 'OK', lip = 'OK', overall = 'OK';
        let details = '';

        if (alertMessages.includes('No face detected for 5 seconds!')) {
            face = 'ALERT';
            overall = 'ALERT';
            details += 'No face detected for 5 seconds!\n';
        }
        if (alertMessages.includes('Multiple faces detected!')) {
            face = 'ALERT';
            overall = 'ALERT';
            details += 'Multiple faces detected!\n';
        }
        if (alertMessages.includes('Constant/suspicious neck movement detected!')) {
            neck = 'ALERT';
            overall = 'ALERT';
            details += 'Constant/suspicious neck movement detected!\n';
        }
        if (alertMessages.includes('Constant lip movement detected!')) {
            lip = 'ALERT';
            overall = 'ALERT';
            details += 'Constant lip movement detected!\n';
        }
        if (alertMessages.includes('Eyes closed or suspicious eye activity detected!')) {
            eye = 'ALERT';
            overall = 'ALERT';
            details += 'Eyes closed or suspicious eye activity detected!\n';
        }
        updateProctoringStatus({ face, neck, eye, lip, overall, details });

        if (alertMessages.length > 0 && !logs.some(log => log.message === alertMessages[alertMessages.length - 1])) {
             addLog(alertMessages[alertMessages.length - 1]);
        }
    }, [alertMessages, addLog, logs, updateProctoringStatus]);

    const resetAlerts = useCallback(() => {
        setAlertMessages([]);
        updateAlerts(); // This will reset the status panel as well
    }, [updateAlerts]);

    useEffect(() => {
        // Initial log
        addLog('System initialized. Ready to connect.');
        resetProctoringStatus();
    }, [addLog, resetProctoringStatus]);

    useEffect(() => {
        updateAlerts(); // Update alerts whenever alertMessages changes
    }, [alertMessages, updateAlerts]);


    const startProctoring = async () => {
        if (wsRef.current) return;

        setConnectionStatusText('Connecting...');
        setConnectionStatusClass('bg-yellow-900 text-yellow-300'); // connecting

        wsRef.current = new WebSocket(`wss://api-demo.tecosys.ai/ws/video`);
        wsRef.current.binaryType = 'arraybuffer';

        wsRef.current.onopen = () => {
            setIsConnected(true);
            setConnectionStatusText('Connected');
            setConnectionStatusClass('bg-green-900 text-green-300'); // connected
            addLog('WebSocket connected');
            resetAlerts();
        };

        wsRef.current.onclose = () => {
            setIsConnected(false);
            setConnectionStatusText('Disconnected');
            setConnectionStatusClass('bg-red-900 text-red-300'); // disconnected
            addLog('WebSocket closed');
            clearInterval(sendFrameIntervalRef.current);
            resetAlerts();
        };

        wsRef.current.onerror = (e) => {
            setIsConnected(false);
            setConnectionStatusText('Connection Error');
            setConnectionStatusClass('bg-red-900 text-red-300'); // disconnected
            addLog('WebSocket error', true);
            clearInterval(sendFrameIntervalRef.current);
            resetAlerts();
        };

        wsRef.current.onmessage = (event) => {
            let msg = event.data;

            let currentAlerts = [];
            let faceMatch = msg.match(/Faces: (\d+)/);
            let neckMatch = msg.match(/Neck movement: [\d.]+ \((\w+)\)/);
            let lipMatch = msg.match(/Lip dist: [\d.]+ \((\w+)\)/);
            let eyeMatch = msg.match(/Eye AR: [\d.]+ \((\w+)\)/);
            let faceCount = faceMatch ? parseInt(faceMatch[1]) : 0;
            let now = Date.now();

            // No face detected for 5s
            if (faceCount === 0) {
                if (!noFaceDetectedSinceRef.current) noFaceDetectedSinceRef.current = now;
                if (now - noFaceDetectedSinceRef.current > 5000) {
                    currentAlerts.push('No face detected for 5 seconds!');
                }
            } else {
                noFaceDetectedSinceRef.current = null;
            }

            // Multiple face detection
            if (faceMatch && parseInt(faceMatch[1]) > 1) {
                currentAlerts.push('Multiple faces detected!');
            }

            // Neck movement alert
            if (neckMatch && neckMatch[1] === 'ALERT') {
                currentAlerts.push('Constant/suspicious neck movement detected!');
            }

            // Lip movement alert
            if (lipMatch && lipMatch[1] === 'ALERT') {
                currentAlerts.push('Constant lip movement detected!');
            }

            // Eye closed alert
            if (eyeMatch && eyeMatch[1] === 'ALERT') {
                currentAlerts.push('Eyes closed or suspicious eye activity detected!');
            }

            setAlertMessages(currentAlerts);
        };

        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
            }

            sendFrameIntervalRef.current = setInterval(() => {
                if (wsRef.current && wsRef.current.readyState === 1 && videoRef.current) {
                    const canvas = canvasRef.current;
                    const video = videoRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(blob => {
                        if (blob) {
                            blob.arrayBuffer().then(buf => wsRef.current.send(buf));
                        }
                    }, 'image/jpeg', 0.8);
                }
            }, 200);
        } catch (err) {
            addLog(`Error accessing camera: ${err.message}`, true);
            setIsConnected(false);
            setConnectionStatusText('Camera Error');
            setConnectionStatusClass('bg-red-900 text-red-300');
        }
    };

    const stopProctoring = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        clearInterval(sendFrameIntervalRef.current);
        sendFrameIntervalRef.current = null;
        setIsConnected(false);
        setConnectionStatusText('Disconnected');
        setConnectionStatusClass('bg-red-900 text-red-300');
        addLog('Proctoring stopped');
        resetProctoringStatus();
        resetAlerts();
    };

    const StatusItem = ({ label, status }) => {
        const bgColor = status === 'OK' ? 'bg-green-800/20 border-green-700' : 'bg-red-800/20 border-red-700 animate-pulse';
        const iconColor = status === 'OK' ? 'bg-green-500' : 'bg-red-500';
        const textColor = status === 'OK' ? 'text-green-300' : 'text-red-300';

        return (
            <div className={`flex items-center p-4 rounded-lg shadow-inner border ${bgColor}`}>
                <div className={`w-6 h-6 rounded-full mr-4 ${iconColor}`}></div>
                <div className="font-semibold text-gray-200">{label}</div>
                <div className={`ml-auto font-bold ${textColor}`}>{status}</div>
            </div>
        );
    };

   // Same imports and logic — unchanged above the return statement

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Title and Connection */}
            <div className="col-span-1 lg:col-span-3 flex justify-between items-center px-4 py-2 rounded-xl bg-gray-800/60 backdrop-blur-md border border-gray-700 shadow-md">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow">
                    AI Proctoring Examination
                </h1>
                <div className={`px-4 py-1 rounded-full font-bold text-sm sm:text-base shadow transition-all duration-300 ${connectionStatusClass}`}>
                    {connectionStatusText}
                </div>
            </div>

            {/* Video Stream */}
            <div className="col-span-1 lg:col-span-2 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-3 sm:p-4 hover:scale-[1.01] transition-transform duration-300 border border-gray-700">
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={startProctoring}
                        disabled={isConnected}
                        className={`px-6 py-2 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-lg transition-all duration-300
                            ${isConnected ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
                    >
                        Start
                    </button>
                    <button
                        onClick={stopProctoring}
                        disabled={!isConnected}
                        className={`px-6 py-2 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-lg transition-all duration-300
                            ${!isConnected ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-md'}`}
                    >
                        Stop
                    </button>
                </div>
            </div>

            {/* Status Panel */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl p-4 border border-gray-700 hover:scale-[1.01] transition-transform duration-300">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-300 mb-4 text-center">Status Monitor</h2>
                <div className="space-y-3">
                    <StatusItem label="Face" status={faceStatus} />
                    <StatusItem label="Neck" status={neckStatus} />
                    <StatusItem label="Eyes" status={eyeStatus} />
                    <StatusItem label="Lips" status={lipStatus} />
                </div>
            </div>

            {/* Overall Status (Sticky + Slim) */}
            <div className={`col-span-1 lg:col-span-3 text-center font-extrabold text-xl sm:text-2xl mt-2 px-3 py-2 rounded-lg border shadow-md transition-all duration-300
                ${overallStatus === 'OK' ? 'bg-green-800/20 text-green-300 border-green-700' : 'bg-red-800/20 text-red-300 border-red-700 animate-pulse'}`}>
                Overall Status: {overallStatus}
            </div>

            {/* Details (if any) */}
            {detailsContent && (
                <div className="col-span-1 lg:col-span-3 bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700 p-4 mt-2 shadow-md">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-2">Details</h3>
                    <pre className="bg-gray-900/30 text-gray-200 p-3 rounded-lg text-xs sm:text-sm whitespace-pre-wrap leading-snug">
                        {detailsContent}
                    </pre>
                </div>
            )}

            {/* Logs (minimized) */}
            <div className="col-span-1 lg:col-span-3 bg-gray-900/50 rounded-xl border border-gray-700 p-3 mt-2 shadow-inner h-40 overflow-y-auto text-xs sm:text-sm scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <h2 className="text-center font-bold text-blue-300 mb-1">System Logs</h2>
                {logs.map((log, index) => (
                    <div key={index} className="flex text-xs mb-1">
                        <span className="text-green-500 font-mono mr-2 flex-shrink-0">{log.time}</span>
                        <span className={`font-mono ${log.isError ? 'text-red-400' : 'text-gray-300'}`}>{log.message}</span>
                    </div>
                ))}
                {logs.length === 0 && <p className="text-gray-500 text-center">No recent logs.</p>}
            </div>
        </div>
    </div>
);

};

export default ProctoringDemo;