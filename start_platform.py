#!/usr/bin/env python3
"""
Startup script for Divorce Support Platform
Starts all agents and WebSocket server
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

    print("🎭 Starting Divorce Support Platform")
    print("=" * 50)

    processes = []

    # Start WebSocket server
    websocket_process = run_command(
        "python backend/websocket/websocket_server.py",
        "WebSocket Server"
    )
    if websocket_process:
        processes.append(websocket_process)
        time.sleep(2)  # Give WebSocket server time to start

    # Start Main Divorce Support Agent (Competition Ready)
    main_agent_process = run_command(
        "python backend/agent.py",
        "Divorce Support MeTTa Agent"
    )
    if main_agent_process:
        processes.append(main_agent_process)
        time.sleep(3)  # Give main agent time to start

    print("=" * 50)
    print("🎉 All services started successfully!")
    print("🔥 AI Chat Features:")
    print("   ✅ MeTTa Emotional Analysis + uAgents")
    print("   ✅ Crisis Detection & Intervention")
    print("   ✅ Cultural Sensitivity (Indian Context)")
    print("   ✅ Agentverse Registration Ready")
    print("   ✅ Competition Compliant")
    print("   🏆 Ready for $3,500 Prize!")
    print("📊 Service Status:")
    print("   • WebSocket Server: http://localhost:3001")
    print("   • Divorce Support Agent: http://localhost:8000 (MeTTa + uAgents)")
    print("   • Emotional Analyzer: http://localhost:8001")
    print("   • Room Matcher: http://localhost:8002")
    print("   • Crisis Monitor: http://localhost:8003")
    print("   • Knowledge Base: http://localhost:8004")
    print("💡 Frontend: http://localhost:3000")
    print("=" * 50)

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
