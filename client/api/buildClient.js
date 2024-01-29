import axios from 'axios';

function buildClient({ req }) {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers,
  });
}

export default buildClient;
