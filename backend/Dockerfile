FROM python:3.13-slim AS builder

# Set the working directory
WORKDIR /app/backend

# Set environment variables to optimize Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install packages
RUN pip install uv --no-cache
COPY requirements.txt requirements.txt
RUN uv pip install -r requirements.txt --system --no-cache


# Stage 2: Production stage
FROM python:3.13-slim

RUN useradd -m -r appuser && \
   mkdir -p /app/backend/static /app/backend/media &&  \
   chown -R appuser:appuser /app

# Copy the Python dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

# Set the working directory
WORKDIR /app/backend/

# Copy application code and dependencies
COPY --chown=appuser:appuser . .
COPY --chown=appuser:appuser uv.lock .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Ensure appuser owns the working directory
RUN chown -R appuser:appuser /app/backend

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8000

# Make entry file executable
RUN chmod +x /app/backend/wait-for-postgres.sh
RUN chmod +x /app/backend/entrypoint.sh

# Start the application using Gunicorn
CMD ["/app/backend/entrypoint.sh"]