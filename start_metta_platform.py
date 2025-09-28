#!/usr/bin/env python3
"""
Startup script for Divorce Support Platform with MeTTa Chat API
Starts all services including the integrated chat API
"""

import asyncio
import subprocess
import sys
import os
import time
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

def run_command(cmd, description):
    """Run a command and return the process"""
    print(f"🚀 Starting {description}...")
    try:
        process = subprocess.Popen(cmd, shell=True)
        print(f"✅ {description} started with PID {process.pid}")
        return process
    except Exception as e:
        print(f"❌ Failed to start {description}: {e}")
        return None

def main():
    """Main startup function"""

    print("🎭 Starting Divorce Support Platform with MeTTa Integration")
    print("=" * 60)

    processes = []

    # Start Chat API Server (MeTTa integration)
    chat_api_process = run_command(
        "python backend/chat_api.py",
        "Chat API Server (MeTTa Integration)"
    )
    if chat_api_process:
        processes.append(chat_api_process)
        time.sleep(3)  # Give Chat API time to start

    # Start WebSocket server
    websocket_process = run_command(
        "python backend/websocket/websocket_server.py",
        "WebSocket Server"
    )
    if websocket_process:
        processes.append(websocket_process)
        time.sleep(2)  # Give WebSocket server time to start

    # Start Orchestrator Agent
    orchestrator_process = run_command(
        "python backend/agents/orchestrator_agent.py",
        "Orchestrator Agent"
    )
    if orchestrator_process:
        processes.append(orchestrator_process)
        time.sleep(1)

    # Start Emotional Analyzer Agent
    emotional_analyzer_process = run_command(
        "python backend/agents/emotional_analyzer_agent.py",
        "Emotional Analyzer Agent"
    )
    if emotional_analyzer_process:
        processes.append(emotional_analyzer_process)
        time.sleep(1)

    # Start Room Matcher Agent
    room_matcher_process = run_command(
        "python backend/agents/room_matcher_agent.py",
        "Room Matcher Agent"
    )
    if room_matcher_process:
        processes.append(room_matcher_process)
        time.sleep(1)

    # Start Crisis Monitor Agent
    crisis_monitor_process = run_command(
        "python backend/agents/crisis_monitor_agent.py",
        "Crisis Monitor Agent"
    )
    if crisis_monitor_process:
        processes.append(crisis_monitor_process)
        time.sleep(1)

    # Start Knowledge Base Agent
    knowledge_base_process = run_command(
        "python backend/agents/knowledge_base_agent.py",
        "Knowledge Base Agent"
    )
    if knowledge_base_process:
        processes.append(knowledge_base_process)
        time.sleep(1)

    print("=" * 60)
    print("🎉 All services started successfully!")
    print("📊 Service Status:")
    print("   • Chat API (MeTTa): http://localhost:8006")
    print("   • WebSocket Server: http://localhost:3001")
    print("   • Orchestrator Agent: http://localhost:8000")
    print("   • Emotional Analyzer: http://localhost:8001")
    print("   • Room Matcher: http://localhost:8002")
    print("   • Crisis Monitor: http://localhost:8003")
    print("   • Knowledge Base: http://localhost:8004")
    print("💡 Frontend: http://localhost:3000")
    print("=" * 60)
    print("🔥 AI Chat Features:")
    print("   ✅ MeTTa Emotional Analysis")
    print("   ✅ Crisis Detection & Intervention")
    print("   ✅ Cultural Sensitivity")
    print("   ✅ Room Suggestions")
    print("   ✅ Resource Recommendations")
    print("   ✅ Human Counselor Escalation")
    print("=" * 60)

    try:
        # Keep the script running
        while True:
            time.sleep(1)

            # Check if any processes have died
            for i, process in enumerate(processes):
                if process.poll() is not None:
                    print(f"⚠️  Process {i} has stopped with exit code {process.poll()}")

    except KeyboardInterrupt:
        print("\n🛑 Shutting down all services...")

        # Terminate all processes
        for process in processes:
            if process.poll() is None:  # Process is still running
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()

        print("✅ All services stopped")

if __name__ == "__main__":
    main()
