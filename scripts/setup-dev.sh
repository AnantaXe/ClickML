#!/bin/bash

# ClickML Development Setup Script

echo "🚀 Setting up ClickML development environment..."

# Check if Python 3.8+ is installed
python_version=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+' | head -1)
if [ -z "$python_version" ]; then
    echo "❌ Python 3.8+ is required but not found"
    exit 1
fi

echo "✅ Python $python_version found"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Install ClickML in development mode
echo "🛠️ Installing ClickML in development mode..."
pip install -e .

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p models data logs

# Copy environment file
if [ ! -f ".env" ]; then
    echo "⚙️ Creating environment configuration..."
    cp .env.example .env
    echo "📝 Please update .env file with your configuration"
fi

# Run tests
echo "🧪 Running tests..."
pytest tests/ -v

echo ""
echo "🎉 ClickML development environment is ready!"
echo ""
echo "To start the server:"
echo "  source venv/bin/activate"
echo "  clickml server"
echo ""
echo "To run tests:"
echo "  pytest tests/"
echo ""
echo "API will be available at: http://localhost:8000"
echo "API docs will be available at: http://localhost:8000/docs"