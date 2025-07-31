"""CLI interface for ClickML"""

import argparse
import sys
from clickml.config import Config


def create_parser():
    """Create command line parser"""
    parser = argparse.ArgumentParser(
        description="ClickML - Low-code MLOps platform",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument(
        "--version", 
        action="version", 
        version="ClickML 0.1.0"
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Server command
    server_parser = subparsers.add_parser("server", help="Start the ClickML server")
    server_parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    server_parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    server_parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    
    # Pipeline commands
    pipeline_parser = subparsers.add_parser("pipeline", help="Pipeline management")
    pipeline_subparsers = pipeline_parser.add_subparsers(dest="pipeline_action")
    
    # Create pipeline
    create_parser = pipeline_subparsers.add_parser("create", help="Create a new pipeline")
    create_parser.add_argument("name", help="Pipeline name")
    create_parser.add_argument("--description", help="Pipeline description")
    
    # List pipelines
    pipeline_subparsers.add_parser("list", help="List all pipelines")
    
    return parser


def start_server(args):
    """Start the ClickML server"""
    import uvicorn
    from backend.app import create_app
    
    config = Config.load()
    app = create_app(config)
    
    uvicorn.run(
        app,
        host=args.host,
        port=args.port,
        reload=args.reload
    )


def handle_pipeline_commands(args):
    """Handle pipeline-related commands"""
    if args.pipeline_action == "create":
        from clickml.core import Pipeline
        pipeline = Pipeline(name=args.name, description=args.description)
        print(f"Created pipeline: {pipeline.name}")
    
    elif args.pipeline_action == "list":
        # TODO: Implement pipeline listing from storage
        print("Pipeline listing not yet implemented")


def main():
    """Main CLI entry point"""
    parser = create_parser()
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    try:
        if args.command == "server":
            start_server(args)
        elif args.command == "pipeline":
            handle_pipeline_commands(args)
        else:
            print(f"Unknown command: {args.command}")
            sys.exit(1)
    
    except KeyboardInterrupt:
        print("\nShutting down...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()