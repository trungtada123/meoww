bind = "0.0.0.0:10000"
workers = 2
timeout = 120
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
preload_app = True 