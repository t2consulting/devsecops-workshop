from flask import Flask, request, jsonify
from flask_cors import CORS
from kubernetes import client, config
import os

app = Flask(__name__)
CORS(app)

# Load Kubernetes configuration
# When running in-cluster, this will use the pod's service account
config.load_incluster_config()
v1 = client.CoreV1Api()


@app.route('/deploy/execution', methods=['GET'])
def execution_details():
    service_name = os.getenv('SERVICE_NAME', '')
    last_execution_id = os.getenv('LAST_EXECUTION_ID', '')
    application_version = os.getenv('APPLICATION_VERSION', '')
    deployment_type = 'normal'
    hostname = os.getenv('HOSTNAME', '')
    if 'canary' in hostname:
        deployment_type = 'canary'

    payload = {
        "service_name": service_name,
        "last_execution_id": last_execution_id,
        "application_version": application_version,
        "deployment_type": deployment_type
    }
    return jsonify(payload)

@app.route('/deploy/pods', methods=['GET'])
def get_pods():
    try:
        # Get the namespace from the pod's environment variable
        namespace = os.environ.get('POD_NAMESPACE', 'default')
        
        # Get query parameter from request
        query = request.args.get('query', '')
        
        # Get all pods in the namespace
        pod_list = v1.list_namespaced_pod(namespace=namespace)
        
        # Filter pods containing the query string in their name
        matching_pods = [
            {
                'name': pod.metadata.name,
                'status': pod.status.phase,
                'ip': pod.status.pod_ip,
                'node': pod.spec.node_name
            }
            for pod in pod_list.items
            if query.lower() in pod.metadata.name.lower()
        ]
        
        return jsonify({
            'status': 'success',
            'namespace': namespace,
            'pods': matching_pods,
            'count': len(matching_pods)
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
